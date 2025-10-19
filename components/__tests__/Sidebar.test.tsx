import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../Sidebar';
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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
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

describe('Sidebar', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    
    // Mock admin user by default
    (usersApi.getAll as jest.Mock).mockResolvedValue([
      {
        _id: '1',
        name: 'Test Admin',
        email: 'admin@example.com',
        status: 'active',
        roles: ['admin'],
        activeRole: 'admin',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]);
  });

  it('renders the application title', async () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Material UI 3')).toBeInTheDocument();
  });

  it('renders all menu items for admin role', async () => {
    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
      expect(screen.getByText('ผู้ใช้')).toBeInTheDocument();
      expect(screen.getByText('สินค้า')).toBeInTheDocument();
      expect(screen.getByText('คำสั่งซื้อ')).toBeInTheDocument();
      expect(screen.getByText('การวิเคราะห์')).toBeInTheDocument();
      expect(screen.getByText('การตั้งค่า')).toBeInTheDocument();
    });
  });

  it('has correct number of menu items for admin', async () => {
    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      const menuItems = screen.getAllByRole('link');
      expect(menuItems).toHaveLength(6);
    });
  });

  it('menu items have correct href attributes', async () => {
    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /แดชบอร์ด/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /ผู้ใช้/i })).toHaveAttribute('href', '/users');
      expect(screen.getByRole('link', { name: /สินค้า/i })).toHaveAttribute('href', '/products');
      expect(screen.getByRole('link', { name: /คำสั่งซื้อ/i })).toHaveAttribute('href', '/orders');
      expect(screen.getByRole('link', { name: /การวิเคราะห์/i })).toHaveAttribute('href', '/analytics');
      expect(screen.getByRole('link', { name: /การตั้งค่า/i })).toHaveAttribute('href', '/settings');
    });
  });

  it('filters menu items for user role', async () => {
    (usersApi.getAll as jest.Mock).mockResolvedValue([
      {
        _id: '2',
        name: 'Test User',
        email: 'user@example.com',
        status: 'active',
        roles: ['user'],
        activeRole: 'user',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]);

    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      // User should only see dashboard
      expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
      const menuItems = screen.getAllByRole('link');
      expect(menuItems).toHaveLength(1);
    });
  });

  it('filters menu items for editor role', async () => {
    (usersApi.getAll as jest.Mock).mockResolvedValue([
      {
        _id: '3',
        name: 'Test Editor',
        email: 'editor@example.com',
        status: 'active',
        roles: ['editor'],
        activeRole: 'editor',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]);

    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      // Editor should see dashboard, products, and orders
      expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
      expect(screen.getByText('สินค้า')).toBeInTheDocument();
      expect(screen.getByText('คำสั่งซื้อ')).toBeInTheDocument();
      const menuItems = screen.getAllByRole('link');
      expect(menuItems).toHaveLength(3);
    });
  });
});
