import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SessionExpiredModal from '../components/SessionExpiredModal';
import { useWeb3Store } from '../stores/useWeb3Store';

jest.mock('../stores/useWeb3Store');
jest.mock('../lib/walletConnector', () => ({ createWalletConnector: jest.fn() }));

const mockUseWeb3Store = useWeb3Store as jest.MockedFunction<typeof useWeb3Store>;

function setupStore(
  overrides: Partial<{
    connectWallet: jest.Mock;
    walletType: string | null;
    isConnecting: boolean;
  }> = {}
) {
  const state = {
    connectWallet: jest.fn().mockResolvedValue(undefined),
    walletType: 'freighter',
    isConnecting: false,
    ...overrides,
  };
  mockUseWeb3Store.mockImplementation((selector: any) => {
    if (typeof selector === 'function') return selector(state);
    return state as any;
  });
  return state;
}

describe('SessionExpiredModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    setupStore();
    const { container } = render(<SessionExpiredModal isOpen={false} onReconnect={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal when isOpen is true', () => {
    setupStore();
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows the session expired title', () => {
    setupStore();
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);
    expect(screen.getByText('Session Expired')).toBeInTheDocument();
  });

  it('shows inactivity message mentioning 15 minutes', () => {
    setupStore();
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);
    expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
  });

  it('has a reconnect button in idle state', () => {
    setupStore();
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);
    expect(screen.getByRole('button', { name: /reconnect wallet/i })).toBeInTheDocument();
  });

  it('calls connectWallet with walletType and then onReconnect on click', async () => {
    const connectWallet = jest.fn().mockResolvedValue(undefined);
    const onReconnect = jest.fn();
    setupStore({ connectWallet });

    render(<SessionExpiredModal isOpen={true} onReconnect={onReconnect} />);
    fireEvent.click(screen.getByRole('button', { name: /reconnect wallet/i }));

    await waitFor(() => expect(connectWallet).toHaveBeenCalledWith('freighter'));
    expect(onReconnect).toHaveBeenCalledTimes(1);
  });

  it('calls connectWallet with undefined when walletType is null', async () => {
    const connectWallet = jest.fn().mockResolvedValue(undefined);
    const onReconnect = jest.fn();
    setupStore({ connectWallet, walletType: null });

    render(<SessionExpiredModal isOpen={true} onReconnect={onReconnect} />);
    fireEvent.click(screen.getByRole('button', { name: /reconnect wallet/i }));

    await waitFor(() => expect(connectWallet).toHaveBeenCalledWith(undefined));
  });

  it('disables button and shows Reconnecting text while isConnecting', () => {
    setupStore({ isConnecting: true });
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/reconnecting/i);
  });

  it('has aria-modal and aria-labelledby set correctly', () => {
    setupStore();
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'session-expired-title');
  });

  it('security notice mentions authentication tokens', () => {
    setupStore();
    render(<SessionExpiredModal isOpen={true} onReconnect={jest.fn()} />);
    expect(screen.getByText(/authentication tokens/i)).toBeInTheDocument();
  });
});
