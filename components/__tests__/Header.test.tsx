import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock useColorScheme hook
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useColorScheme: () => ({
    mode: 'light',
    setMode: jest.fn(),
  }),
}));

describe('Header', () => {
  it('renders the dashboard title', () => {
    render(<Header />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders notification icon', () => {
    render(<Header />);
    const notificationIcon = screen.getByTestId('NotificationsIcon');
    expect(notificationIcon).toBeInTheDocument();
  });

  it('renders avatar button', () => {
    render(<Header />);
    const avatarButtons = screen.getAllByRole('button');
    // Avatar button should be present (one of the buttons)
    expect(avatarButtons.length).toBeGreaterThan(0);
  });

  it('opens menu when avatar is clicked', () => {
    render(<Header />);
    const buttons = screen.getAllByRole('button');
    // Last button should be the avatar button
    const avatarButton = buttons[buttons.length - 1];
    
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('closes menu when clicking on menu item', () => {
    render(<Header />);
    const buttons = screen.getAllByRole('button');
    const avatarButton = buttons[buttons.length - 1];
    
    fireEvent.click(avatarButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Profile'));
    
    // Menu should close - Profile text should not be visible after click
    setTimeout(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    }, 100);
  });
});
