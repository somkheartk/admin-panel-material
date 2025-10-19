# Role-Switching Feature Implementation Summary

## Overview
This implementation adds the ability for users to have multiple roles and switch between them dynamically. The menu items are filtered based on the user's currently active role.

## Problem Statement (Thai)
"1 user มีได้ มากกว่า 1 roles อยากให้สามารถสลับ roles ได้และ menu เกิดขึ้นตาม roles"

Translation: "1 user can have more than 1 roles. Want to be able to switch roles and the menu should appear according to roles"

## Implementation Details

### 1. Backend (Already Implemented)
The backend already had full support for multiple roles:
- User schema includes `roles: string[]` and `activeRole: string`
- API endpoint `PATCH /users/:id/switch-role` for switching roles
- Validation to ensure the role being switched to exists in the user's roles array

### 2. Frontend Components

#### UserContext (`lib/UserContext.tsx`)
- **Purpose**: Manages the current logged-in user and their active role
- **Features**:
  - Loads user from localStorage on mount (simulates authentication)
  - Provides `switchRole()` function to change the active role
  - Updates the user state when role is switched
  - Persists current user ID in localStorage

#### Menu Configuration (`lib/menuConfig.ts`)
- **Purpose**: Defines which roles can access which menu items
- **Access Control Matrix**:
  ```
  Route         | admin | manager | editor | viewer | user
  --------------|-------|---------|--------|--------|------
  /             |   ✓   |    ✓    |   ✓    |   ✓    |  ✓
  /users        |   ✓   |    ✓    |   ✗    |   ✗    |  ✗
  /products     |   ✓   |    ✓    |   ✓    |   ✗    |  ✗
  /orders       |   ✓   |    ✓    |   ✓    |   ✗    |  ✗
  /analytics    |   ✓   |    ✓    |   ✗    |   ✓    |  ✗
  /settings     |   ✓   |    ✗    |   ✗    |   ✗    |  ✗
  ```

#### Updated Components

##### Header Component (`components/Header.tsx`)
- **New Features**:
  - Displays role switcher button when user has multiple roles
  - Shows current active role with localized name
  - Opens role menu on click
  - Highlights current active role with checkmark icon
  - Handles role switching with loading state
  - Shows error message if role switch fails

##### Sidebar Component (`components/Sidebar.tsx`)
- **New Features**:
  - Filters menu items based on user's active role
  - Only displays menu items the current role can access
  - Uses `canAccessMenuItem()` helper function for filtering

##### Root Layout (`app/layout.tsx`)
- **Changes**:
  - Added `UserProvider` to wrap the entire application
  - Ensures user context is available to all components

### 3. Test Coverage

#### UserContext Tests (`lib/__tests__/UserContext.test.tsx`)
- ✅ Loads user from API on mount when no saved userId
- ✅ Loads user from saved userId in localStorage
- ✅ Switches user role successfully
- ✅ Throws error when useUser is used outside UserProvider

#### Menu Configuration Tests (`lib/__tests__/menuConfig.test.ts`)
- ✅ Validates menuConfig structure (6 tests)
- ✅ Tests `canAccessMenuItem()` function (6 tests)
- ✅ Tests `getAccessibleMenuItems()` function (6 tests)

#### Updated Component Tests
- ✅ Sidebar tests with role-based filtering (6 tests)
- ✅ Header tests with role switcher support (7 tests)

**Total: 43 tests passing**

## User Roles Defined

1. **admin** - Full access to all features
2. **manager** - Can manage users, products, orders, and view analytics (no settings access)
3. **editor** - Can manage products and orders (no user management or analytics)
4. **viewer** - Can view dashboard and analytics only (read-only)
5. **user** - Can only view dashboard (minimal access)

## How It Works

1. **User Login**: When the app loads, it fetches the current user from the backend
2. **Role Display**: If the user has multiple roles, a role switcher button appears in the header
3. **Menu Filtering**: The sidebar dynamically filters menu items based on the active role
4. **Role Switching**: 
   - User clicks the role switcher button
   - Selects a different role from the dropdown
   - Frontend calls the backend API to update the active role
   - Menu items are immediately updated to reflect the new role's permissions

## Example Scenarios

### Scenario 1: Admin User
```
User: { roles: ['admin', 'manager'], activeRole: 'admin' }
Visible Menu Items: Dashboard, Users, Products, Orders, Analytics, Settings (All 6 items)
```

### Scenario 2: Editor Switching to Viewer
```
Initial: { roles: ['editor', 'viewer'], activeRole: 'editor' }
Visible Items: Dashboard, Products, Orders (3 items)

After Switch: { roles: ['editor', 'viewer'], activeRole: 'viewer' }
Visible Items: Dashboard, Analytics (2 items)
```

### Scenario 3: Single Role User
```
User: { roles: ['user'], activeRole: 'user' }
Visible Items: Dashboard (1 item)
Role Switcher: Not displayed (only one role)
```

## Localization Support

All role names are translated in both Thai and English:
- **Thai**: ผู้ดูแล (admin), ผู้จัดการ (manager), บรรณาธิการ (editor), ผู้ชม (viewer), ผู้ใช้ (user)
- **English**: Admin, Manager, Editor, Viewer, User

## Security Considerations

1. **Frontend Filtering**: Menu items are hidden based on roles (UI-level security)
2. **Backend Validation**: The backend should also validate role permissions for API requests
3. **Role Validation**: When switching roles, the backend validates that the role exists in the user's roles array

## Benefits

1. **Flexible Access Control**: Users can have multiple roles and switch between them as needed
2. **Dynamic UI**: Menu adapts automatically based on the active role
3. **User-Friendly**: Clear indication of current role and easy switching mechanism
4. **Scalable**: Easy to add new roles or modify existing role permissions
5. **Type-Safe**: Full TypeScript support with proper type definitions
6. **Well-Tested**: Comprehensive test coverage for all new functionality

## Files Changed/Added

### New Files:
- `lib/UserContext.tsx` - User context provider
- `lib/menuConfig.ts` - Menu access control configuration
- `lib/__tests__/UserContext.test.tsx` - User context tests
- `lib/__tests__/menuConfig.test.ts` - Menu config tests

### Modified Files:
- `app/layout.tsx` - Added UserProvider
- `components/Header.tsx` - Added role switcher UI
- `components/Sidebar.tsx` - Added role-based menu filtering
- `components/__tests__/Header.test.tsx` - Updated tests
- `components/__tests__/Sidebar.test.tsx` - Updated tests

## Future Enhancements

1. **Route Protection**: Add route guards to prevent unauthorized access to pages
2. **Permission-Based Actions**: Hide/disable specific buttons based on permissions
3. **Audit Log**: Track when users switch roles for security auditing
4. **Role Expiry**: Implement time-based role assignments
5. **Default Role**: Allow users to set a default role for automatic selection on login
