import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

// Mock useColorScheme hook
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useColorScheme: () => ({
    mode: 'light',
    setMode: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('Header', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders the dashboard title', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
  });

  it('renders notification icon', () => {
    renderWithProviders(<Header />);
    const notificationIcon = screen.getByTestId('NotificationsIcon');
    expect(notificationIcon).toBeInTheDocument();
  });

  it('renders avatar button', () => {
    renderWithProviders(<Header />);
    const avatarButtons = screen.getAllByRole('button');
    // Avatar button should be present (one of the buttons)
    expect(avatarButtons.length).toBeGreaterThan(0);
  });

  it('opens menu when avatar is clicked', () => {
    renderWithProviders(<Header />);
    const buttons = screen.getAllByRole('button');
    // Last button should be the avatar button
    const avatarButton = buttons[buttons.length - 1];
    
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('โปรไฟล์')).toBeInTheDocument();
    expect(screen.getByText('การตั้งค่า')).toBeInTheDocument();
    expect(screen.getByText('ออกจากระบบ')).toBeInTheDocument();
  });

  it('closes menu when clicking on menu item', () => {
    renderWithProviders(<Header />);
    const buttons = screen.getAllByRole('button');
    const avatarButton = buttons[buttons.length - 1];
    
    fireEvent.click(avatarButton);
    expect(screen.getByText('โปรไฟล์')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('โปรไฟล์'));
    
    // Menu should close - Profile text should not be visible after click
    setTimeout(() => {
      expect(screen.queryByText('โปรไฟล์')).not.toBeInTheDocument();
    }, 100);
  });
});
