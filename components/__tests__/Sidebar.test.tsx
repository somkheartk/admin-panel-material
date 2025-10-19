import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

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
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('Sidebar', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders the application title', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Material UI 3')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    renderWithProviders(<Sidebar />);
    
    expect(screen.getByText('แดชบอร์ด')).toBeInTheDocument();
    expect(screen.getByText('ผู้ใช้')).toBeInTheDocument();
    expect(screen.getByText('สินค้า')).toBeInTheDocument();
    expect(screen.getByText('คำสั่งซื้อ')).toBeInTheDocument();
    expect(screen.getByText('การวิเคราะห์')).toBeInTheDocument();
    expect(screen.getByText('การตั้งค่า')).toBeInTheDocument();
  });

  it('has correct number of menu items', () => {
    renderWithProviders(<Sidebar />);
    const menuItems = screen.getAllByRole('link');
    expect(menuItems).toHaveLength(6);
  });

  it('menu items have correct href attributes', () => {
    renderWithProviders(<Sidebar />);
    
    expect(screen.getByRole('link', { name: /แดชบอร์ด/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /ผู้ใช้/i })).toHaveAttribute('href', '/users');
    expect(screen.getByRole('link', { name: /สินค้า/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /คำสั่งซื้อ/i })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /การวิเคราะห์/i })).toHaveAttribute('href', '/analytics');
    expect(screen.getByRole('link', { name: /การตั้งค่า/i })).toHaveAttribute('href', '/settings');
  });
});
