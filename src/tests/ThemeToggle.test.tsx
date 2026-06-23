import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider, useTheme } from '../lib/context/ThemeContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

function clearDocumentClass() {
  document.documentElement.className = '';
}

beforeEach(() => {
  clearDocumentClass();
  jest.clearAllMocks();
  window.localStorage.clear();
});

describe('ThemeContext', () => {
  it('defaults to dark theme when system preference is dark', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe('dark');
  });

  it('defaults to light theme when system preference is light', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query !== '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe('light');
  });

  it('reads persisted theme from localStorage over system preference', () => {
    window.localStorage.setItem('tradeflow-theme', 'light');

    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme switches between dark and light', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });

  it('setTheme sets the theme to the specified value', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('persists theme to localStorage on change', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.toggleTheme();
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('tradeflow-theme', 'light');
  });

  it('applies theme class to document.documentElement', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.className).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.className).toBe('dark');
  });
});

describe('ThemeToggle', () => {
  it('renders the toggle button with switch role', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
  });

  it('reflects the current theme state via aria-checked', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles theme and updates html class when clicked', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('switch');
    expect(document.documentElement.className).toBe('dark');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.className).toBe('light');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.className).toBe('dark');
  });

  it('persists preference to localStorage on toggle', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('switch');

    fireEvent.click(button);

    expect(window.localStorage.setItem).toHaveBeenCalledWith('tradeflow-theme', 'light');
  });

  it('has accessible label that reflects current mode', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('updates label after toggling', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('switch');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });
});
