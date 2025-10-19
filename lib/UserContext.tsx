'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, usersApi } from './api/users';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchRole: (roleId: string) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount (simulating logged-in user)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUserId = localStorage.getItem('currentUserId');
        if (savedUserId) {
          const user = await usersApi.getById(savedUserId);
          setCurrentUser(user);
        } else {
          // For demo purposes, load the first user as the current user
          const users = await usersApi.getAll();
          if (users.length > 0) {
            const user = users[0];
            setCurrentUser(user);
            localStorage.setItem('currentUserId', user._id);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const switchRole = async (roleId: string) => {
    if (!currentUser) {
      console.error('Cannot switch role: No current user');
      throw new Error('No current user');
    }

    console.log('UserContext: Switching role from', currentUser.activeRole, 'to', roleId);
    console.log('User roles:', currentUser.roles);

    try {
      const updatedUser = await usersApi.switchRole(currentUser._id, { activeRole: roleId });
      console.log('UserContext: Role switched successfully, updated user:', updatedUser);
      setCurrentUser(updatedUser);
    } catch (error: any) {
      console.error('UserContext: Failed to switch role:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, switchRole, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
