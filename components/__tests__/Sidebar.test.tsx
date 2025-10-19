import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar', () => {
  it('renders the application title', () => {
    render(<Sidebar />);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Material UI 3')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('has correct number of menu items', () => {
    render(<Sidebar />);
    const menuItems = screen.getAllByRole('link');
    expect(menuItems).toHaveLength(6);
  });

  it('menu items have correct href attributes', () => {
    render(<Sidebar />);
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /users/i })).toHaveAttribute('href', '/users');
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute('href', '/analytics');
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
  });
});
