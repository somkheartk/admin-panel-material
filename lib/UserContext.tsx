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
    if (!currentUser) return;

    try {
      const updatedUser = await usersApi.switchRole(currentUser._id, { activeRole: roleId });
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Failed to switch role:', error);
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
