# Role Switching Feature - Code Examples

## Quick Start Guide

### 1. User Data Structure

Users now have multiple roles and an active role:

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  roles: string[];        // Array of all assigned roles
  activeRole: string;     // Currently active role
  createdAt: string;
  updatedAt: string;
}

// Example user with multiple roles
const user = {
  _id: '123',
  name: 'สมชาย ใจดี',
  email: 'somchai@example.com',
  status: 'active',
  roles: ['admin', 'manager', 'editor'],  // Has 3 roles
  activeRole: 'admin'                      // Currently using admin role
};
```

### 2. Using the UserContext

```typescript
import { useUser } from '@/lib/UserContext';

function MyComponent() {
  const { currentUser, switchRole, isLoading } = useUser();

  // Switch to a different role
  const handleSwitchRole = async (newRole: string) => {
    try {
      await switchRole(newRole);
      console.log('Role switched successfully!');
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h1>Welcome, {currentUser?.name}</h1>
      <p>Current Role: {currentUser?.activeRole}</p>
      <p>All Roles: {currentUser?.roles.join(', ')}</p>
      
      {currentUser?.roles.map(role => (
        <button 
          key={role}
          onClick={() => handleSwitchRole(role)}
          disabled={role === currentUser.activeRole}
        >
          Switch to {role}
        </button>
      ))}
    </div>
  );
}
```

### 3. Checking Menu Access

```typescript
import { canAccessMenuItem } from '@/lib/menuConfig';

// Check if current role can access a menu item
const userCanAccessSettings = canAccessMenuItem('/settings', 'admin');  // true
const userCanAccessSettings2 = canAccessMenuItem('/settings', 'user');  // false

// Get all accessible menu items for a role
import { getAccessibleMenuItems } from '@/lib/menuConfig';

const adminMenus = getAccessibleMenuItems('admin');
// Returns: ['/', '/users', '/products', '/orders', '/analytics', '/settings']

const editorMenus = getAccessibleMenuItems('editor');
// Returns: ['/', '/products', '/orders']
```

### 4. Role-Based Rendering

```typescript
import { useUser } from '@/lib/UserContext';
import { canAccessMenuItem } from '@/lib/menuConfig';

function ConditionalButton() {
  const { currentUser } = useUser();
  
  // Only show button if user has admin role active
  if (currentUser?.activeRole !== 'admin') {
    return null;
  }
  
  return <button>Admin Only Action</button>;
}

// Or check menu access
function MenuBasedButton() {
  const { currentUser } = useUser();
  
  if (!currentUser || !canAccessMenuItem('/settings', currentUser.activeRole)) {
    return null;
  }
  
  return <button>Go to Settings</button>;
}
```

### 5. API Integration

The backend API endpoint for switching roles:

```typescript
// Frontend call
import { usersApi } from '@/lib/api/users';

const switchUserRole = async (userId: string, newRole: string) => {
  try {
    const updatedUser = await usersApi.switchRole(userId, { 
      activeRole: newRole 
    });
    console.log('Updated user:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Switch failed:', error);
    throw error;
  }
};

// Backend endpoint (already implemented)
// PATCH /users/:id/switch-role
// Body: { activeRole: string }
// Response: Updated User object
```

### 6. Complete Example: Custom Role Switcher

```typescript
import React, { useState } from 'react';
import { useUser } from '@/lib/UserContext';
import { Button, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function CustomRoleSwitcher() {
  const { currentUser, switchRole } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [switching, setSwitching] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitch = async (role: string) => {
    if (role === currentUser?.activeRole) {
      handleClose();
      return;
    }

    setSwitching(true);
    try {
      await switchRole(role);
      handleClose();
    } catch (error) {
      alert('Failed to switch role');
    } finally {
      setSwitching(false);
    }
  };

  // Don't show if user has only one role
  if (!currentUser || currentUser.roles.length <= 1) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<SwapHorizIcon />}
        disabled={switching}
      >
        {currentUser.activeRole}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {currentUser.roles.map(role => (
          <MenuItem
            key={role}
            onClick={() => handleSwitch(role)}
            disabled={role === currentUser.activeRole || switching}
          >
            {role === currentUser.activeRole && (
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
            )}
            <Typography>{role}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default CustomRoleSwitcher;
```

### 7. Custom Menu with Role Filtering

```typescript
import React from 'react';
import { useUser } from '@/lib/UserContext';
import { canAccessMenuItem } from '@/lib/menuConfig';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

interface MenuItemData {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

function CustomMenu() {
  const { currentUser } = useUser();
  
  const allMenuItems: MenuItemData[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Users', path: '/users' },
    { label: 'Products', path: '/products' },
    { label: 'Orders', path: '/orders' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Settings', path: '/settings' },
  ];

  // Filter menu items based on active role
  const visibleMenuItems = currentUser
    ? allMenuItems.filter(item => 
        canAccessMenuItem(item.path, currentUser.activeRole)
      )
    : allMenuItems;

  return (
    <List>
      {visibleMenuItems.map(item => (
        <ListItem key={item.path}>
          <ListItemButton href={item.path}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default CustomMenu;
```

### 8. Testing Role Switching

```typescript
import { render, screen, waitFor, act } from '@testing-library/react';
import { UserProvider, useUser } from '@/lib/UserContext';
import { usersApi } from '@/lib/api/users';

// Mock the API
jest.mock('@/lib/api/users');

describe('Role Switching', () => {
  it('switches role successfully', async () => {
    const mockUser = {
      _id: '1',
      name: 'Test User',
      roles: ['admin', 'editor'],
      activeRole: 'admin',
    };

    const updatedUser = { ...mockUser, activeRole: 'editor' };

    (usersApi.getAll as jest.Mock).mockResolvedValue([mockUser]);
    (usersApi.switchRole as jest.Mock).mockResolvedValue(updatedUser);

    function TestComponent() {
      const { currentUser, switchRole } = useUser();
      return (
        <div>
          <span data-testid="role">{currentUser?.activeRole}</span>
          <button onClick={() => switchRole('editor')}>Switch</button>
        </div>
      );
    }

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('admin');
    });

    await act(async () => {
      screen.getByText('Switch').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('editor');
    });

    expect(usersApi.switchRole).toHaveBeenCalledWith('1', { 
      activeRole: 'editor' 
    });
  });
});
```

### 9. Adding New Roles

To add a new role to the system:

1. **Update the menu configuration:**
```typescript
// lib/menuConfig.ts
export const menuConfig: Record<string, string[]> = {
  '/': ['admin', 'manager', 'editor', 'viewer', 'user', 'supervisor'], // Add 'supervisor'
  '/users': ['admin', 'manager', 'supervisor'], // Add to specific routes
  '/products': ['admin', 'manager', 'editor', 'supervisor'],
  '/orders': ['admin', 'manager', 'editor', 'supervisor'],
  '/analytics': ['admin', 'manager', 'viewer', 'supervisor'],
  '/settings': ['admin'],
};
```

2. **Add translations:**
```typescript
// lib/i18n/LanguageContext.tsx
const translations = {
  th: {
    roles: {
      // ... existing roles
      supervisor: 'ผู้ควบคุม',
    },
  },
  en: {
    roles: {
      // ... existing roles
      supervisor: 'Supervisor',
    },
  },
};
```

3. **Update seed data (optional):**
```typescript
// backend/src/seed.ts
const users = [
  { 
    name: 'Supervisor User', 
    roles: ['supervisor', 'editor'], 
    activeRole: 'supervisor' 
  },
];
```

### 10. Advanced: Dynamic Role Permissions

For more complex permission systems:

```typescript
// lib/permissions.ts
interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const rolePermissions: Record<string, Record<string, Permission>> = {
  admin: {
    users: { read: true, create: true, update: true, delete: true },
    products: { read: true, create: true, update: true, delete: true },
    orders: { read: true, create: true, update: true, delete: true },
    settings: { read: true, create: true, update: true, delete: true },
  },
  editor: {
    users: { read: false, create: false, update: false, delete: false },
    products: { read: true, create: true, update: true, delete: false },
    orders: { read: true, create: true, update: true, delete: false },
    settings: { read: false, create: false, update: false, delete: false },
  },
  viewer: {
    users: { read: true, create: false, update: false, delete: false },
    products: { read: true, create: false, update: false, delete: false },
    orders: { read: true, create: false, update: false, delete: false },
    settings: { read: false, create: false, update: false, delete: false },
  },
};

export function hasPermission(
  role: string, 
  resource: string, 
  action: keyof Permission
): boolean {
  return rolePermissions[role]?.[resource]?.[action] ?? false;
}

// Usage
if (hasPermission('editor', 'products', 'delete')) {
  // Show delete button
}
```

## Common Patterns

### Pattern 1: Protecting Routes
```typescript
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import { canAccessMenuItem } from '@/lib/menuConfig';

export function withRoleProtection(Component: React.ComponentType, route: string) {
  return function ProtectedComponent(props: any) {
    const { currentUser } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (currentUser && !canAccessMenuItem(route, currentUser.activeRole)) {
        router.push('/'); // Redirect to dashboard
      }
    }, [currentUser, router]);

    if (!currentUser || !canAccessMenuItem(route, currentUser.activeRole)) {
      return <div>Access Denied</div>;
    }

    return <Component {...props} />;
  };
}

// Usage
export default withRoleProtection(SettingsPage, '/settings');
```

### Pattern 2: Role-Based Component Loading
```typescript
import { useUser } from '@/lib/UserContext';

function Dashboard() {
  const { currentUser } = useUser();

  const getDashboardContent = () => {
    switch (currentUser?.activeRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'editor':
        return <EditorDashboard />;
      case 'viewer':
        return <ViewerDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return <div>{getDashboardContent()}</div>;
}
```

### Pattern 3: Real-time Menu Updates
```typescript
import { useUser } from '@/lib/UserContext';
import { useEffect, useState } from 'react';

function DynamicMenu() {
  const { currentUser } = useUser();
  const [menuVersion, setMenuVersion] = useState(0);

  // Force re-render when role changes
  useEffect(() => {
    setMenuVersion(v => v + 1);
  }, [currentUser?.activeRole]);

  return (
    <nav key={menuVersion}>
      {/* Menu items will re-render on role change */}
    </nav>
  );
}
```

## Troubleshooting

### Issue 1: Menu not updating after role switch
**Solution:** Ensure the component using `useUser()` is within `UserProvider`

### Issue 2: Role switcher not showing
**Check:** User has more than one role in their `roles` array

### Issue 3: API call failing
**Check:** Backend is running and MongoDB is connected

### Issue 4: Tests failing with "useUser must be used within UserProvider"
**Solution:** Wrap test components with `UserProvider` in test setup
