import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../Header';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { UserProvider } from '@/lib/UserContext';
import { usersApi } from '@/lib/api/users';

// Mock the API
jest.mock('@/lib/api/users', () => ({
  usersApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    switchRole: jest.fn(),
  },
}));

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
  return render(
    <LanguageProvider>
      <UserProvider>{component}</UserProvider>
    </LanguageProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    
    // Mock user with multiple roles
    (usersApi.getAll as jest.Mock).mockResolvedValue([
      {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        status: 'active',
        roles: ['admin', 'editor'],
        activeRole: 'admin',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]);
  });

  it('renders the dashboard title', async () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
  });

  it('renders notification icon', async () => {
    renderWithProviders(<Header />);
    const notificationIcon = screen.getByTestId('NotificationsIcon');
    expect(notificationIcon).toBeInTheDocument();
  });

  it('renders avatar button', async () => {
    renderWithProviders(<Header />);
    const avatarButtons = screen.getAllByRole('button');
    // Avatar button should be present (one of the buttons)
    expect(avatarButtons.length).toBeGreaterThan(0);
  });

  it('opens menu when avatar is clicked', async () => {
    renderWithProviders(<Header />);
    const buttons = screen.getAllByRole('button');
    // Last button should be the avatar button
    const avatarButton = buttons[buttons.length - 1];
    
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('โปรไฟล์')).toBeInTheDocument();
    expect(screen.getByText('การตั้งค่า')).toBeInTheDocument();
    expect(screen.getByText('ออกจากระบบ')).toBeInTheDocument();
  });

  it('closes menu when clicking on menu item', async () => {
    renderWithProviders(<Header />);
    const buttons = screen.getAllByRole('button');
    const avatarButton = buttons[buttons.length - 1];
    
    fireEvent.click(avatarButton);
    expect(screen.getByText('โปรไฟล์')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('โปรไฟล์'));
    
    // Menu should close - Profile text should not be visible after click
    await waitFor(() => {
      expect(screen.queryByText('โปรไฟล์')).not.toBeInTheDocument();
    });
  });

  it('shows role switcher when user has multiple roles', async () => {
    renderWithProviders(<Header />);
    
    await waitFor(() => {
      expect(screen.getByText('ผู้ดูแล')).toBeInTheDocument(); // admin in Thai
    });
  });

  it('does not show role switcher for user with single role', async () => {
    (usersApi.getAll as jest.Mock).mockResolvedValue([
      {
        _id: '2',
        name: 'Single Role User',
        email: 'user@example.com',
        status: 'active',
        roles: ['user'],
        activeRole: 'user',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]);

    renderWithProviders(<Header />);
    
    await waitFor(() => {
      // Wait for user to load
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    // Role switcher button should not be present
    expect(screen.queryByText('ผู้ใช้')).not.toBeInTheDocument();
  });
});
