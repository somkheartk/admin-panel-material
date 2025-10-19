import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';
import { usersApi } from '../api/users';

// Mock the API
jest.mock('../api/users', () => ({
  usersApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    switchRole: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to use the context
function TestComponent() {
  const { currentUser, switchRole, isLoading } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div data-testid="user-name">{currentUser?.name || 'No user'}</div>
      <div data-testid="active-role">{currentUser?.activeRole || 'No role'}</div>
      <button onClick={() => switchRole('editor')}>Switch Role</button>
    </div>
  );
}

describe('UserContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('loads user from API on mount when no saved userId', async () => {
    const mockUsers = [
      {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        status: 'active',
        roles: ['admin', 'user'],
        activeRole: 'admin',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    (usersApi.getAll as jest.Mock).mockResolvedValue(mockUsers);

    await act(async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
      expect(screen.getByTestId('active-role')).toHaveTextContent('admin');
    });

    expect(usersApi.getAll).toHaveBeenCalled();
    expect(localStorageMock.getItem('currentUserId')).toBe('1');
  });

  it('loads user from saved userId in localStorage', async () => {
    const mockUser = {
      _id: '123',
      name: 'Saved User',
      email: 'saved@example.com',
      status: 'active',
      roles: ['editor', 'user'],
      activeRole: 'editor',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    localStorageMock.setItem('currentUserId', '123');
    (usersApi.getById as jest.Mock).mockResolvedValue(mockUser);

    await act(async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Saved User');
      expect(screen.getByTestId('active-role')).toHaveTextContent('editor');
    });

    expect(usersApi.getById).toHaveBeenCalledWith('123');
  });

  it('switches user role successfully', async () => {
    const mockUser = {
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      status: 'active',
      roles: ['admin', 'editor'],
      activeRole: 'admin',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const updatedUser = { ...mockUser, activeRole: 'editor' };

    (usersApi.getAll as jest.Mock).mockResolvedValue([mockUser]);
    (usersApi.switchRole as jest.Mock).mockResolvedValue(updatedUser);

    await act(async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('active-role')).toHaveTextContent('admin');
    });

    await act(async () => {
      screen.getByText('Switch Role').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('active-role')).toHaveTextContent('editor');
    });

    expect(usersApi.switchRole).toHaveBeenCalledWith('1', { activeRole: 'editor' });
  });

  it('throws error when useUser is used outside UserProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useUser must be used within a UserProvider');

    console.error = originalError;
  });
});
