import { renderHook, act } from '@testing-library/react';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { useWeb3Store } from '../stores/useWeb3Store';
import { clearWalletCache } from '../lib/walletCache';
import { clearAuthToken } from '../lib/httpClient';

jest.mock('../stores/useWeb3Store');
jest.mock('../lib/walletConnector', () => ({ createWalletConnector: jest.fn() }));
jest.mock('../lib/walletCache', () => ({ clearWalletCache: jest.fn() }));
jest.mock('../lib/httpClient', () => ({ clearAuthToken: jest.fn() }));

const mockUseWeb3Store = useWeb3Store as jest.MockedFunction<typeof useWeb3Store>;

function setupStore(
  overrides: Partial<{
    isConnected: boolean;
    walletType: string | null;
    disconnectWallet: jest.Mock;
  }> = {}
) {
  const disconnectWallet = jest.fn();
  const state = {
    isConnected: true,
    walletType: 'freighter',
    disconnectWallet,
    ...overrides,
  };
  mockUseWeb3Store.mockImplementation((selector: any) => {
    if (typeof selector === 'function') return selector(state);
    return state as any;
  });
  return state;
}

describe('useSessionTimeout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('is not expired initially', () => {
    setupStore();
    const { result } = renderHook(() => useSessionTimeout());
    expect(result.current.isExpired).toBe(false);
  });

  it('expires after 15 minutes of inactivity when connected', () => {
    setupStore();
    const { result } = renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000 + 600);
    });

    expect(result.current.isExpired).toBe(true);
  });

  it('clears wallet cache and auth token on expiry', () => {
    const state = setupStore();
    renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000 + 600);
    });

    expect(clearWalletCache).toHaveBeenCalledTimes(1);
    expect(clearAuthToken).toHaveBeenCalledTimes(1);
    expect(state.disconnectWallet).toHaveBeenCalledTimes(1);
  });

  it('does not expire before 15 minutes', () => {
    setupStore();
    const { result } = renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(14 * 60 * 1000);
    });

    expect(result.current.isExpired).toBe(false);
  });

  it('resets timer on user activity (mousemove)', () => {
    setupStore();
    const { result } = renderHook(() => useSessionTimeout());

    // Advance 14 minutes then simulate activity
    act(() => {
      jest.advanceTimersByTime(14 * 60 * 1000);
    });

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove'));
      jest.advanceTimersByTime(600); // flush debounce
    });

    // Another 14 minutes — timer was reset so still not expired
    act(() => {
      jest.advanceTimersByTime(14 * 60 * 1000);
    });

    expect(result.current.isExpired).toBe(false);
  });

  it('resets timer on keydown event', () => {
    setupStore();
    const { result } = renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(14 * 60 * 1000);
    });

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      jest.advanceTimersByTime(600);
    });

    act(() => {
      jest.advanceTimersByTime(14 * 60 * 1000);
    });

    expect(result.current.isExpired).toBe(false);
  });

  it('does not start timer when wallet is not connected', () => {
    setupStore({ isConnected: false });
    const { result } = renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000 + 600);
    });

    expect(result.current.isExpired).toBe(false);
    expect(clearWalletCache).not.toHaveBeenCalled();
  });

  it('dismissExpiry clears the expired state', () => {
    setupStore();
    const { result } = renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000 + 600);
    });

    expect(result.current.isExpired).toBe(true);

    act(() => {
      result.current.dismissExpiry();
    });

    expect(result.current.isExpired).toBe(false);
  });

  it('removes all activity listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    setupStore();

    const { unmount } = renderHook(() => useSessionTimeout());
    unmount();

    const removedEvents = removeEventListenerSpy.mock.calls.map((c) => c[0]);
    expect(removedEvents).toContain('mousemove');
    expect(removedEvents).toContain('keydown');
    expect(removedEvents).toContain('mousedown');
    expect(removedEvents).toContain('touchstart');
    expect(removedEvents).toContain('scroll');

    removeEventListenerSpy.mockRestore();
  });

  it('keeps expired state when wallet disconnects externally after timeout', () => {
    setupStore({ isConnected: true });
    const { result, rerender } = renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000 + 600);
    });

    expect(result.current.isExpired).toBe(true);

    // Simulate external wallet disconnect (modal still showing — user must reconnect)
    setupStore({ isConnected: false });

    act(() => {
      rerender();
    });

    expect(result.current.isExpired).toBe(true);
  });
});
