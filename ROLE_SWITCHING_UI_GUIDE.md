# Role Switching Feature - Visual Guide

## UI Components Added/Modified

### 1. Header - Role Switcher Button

When a user has multiple roles, a role switcher button appears in the header:

```
┌────────────────────────────────────────────────────────────────┐
│  Dashboard              [ผู้ดูแล ▼] [EN] [🌙] [🔔] [👤]        │
└────────────────────────────────────────────────────────────────┘
                              ↑
                    Role Switcher Button
                  (Shows current active role)
```

**Features:**
- Displays the current active role name (localized)
- Only visible when user has 2+ roles
- Click to open role selection menu
- Shows loading spinner during role switch

### 2. Role Selection Menu

When clicking the role switcher button, a dropdown menu appears:

```
┌────────────────────────┐
│  Switch Role           │
├────────────────────────┤
│ ✓ ผู้ดูแล (Admin)      │  ← Currently active (checkmark)
│   บรรณาธิการ (Editor)  │  ← Can switch to this
│   ผู้ชม (Viewer)       │  ← Can switch to this
└────────────────────────┘
```

**Features:**
- Lists all available roles for the user
- Current role is highlighted with a checkmark
- Click any role to switch
- Menu closes after selection
- Shows error message if switch fails

### 3. Sidebar - Dynamic Menu Filtering

The sidebar menu changes based on the active role:

#### Admin Role (Full Access)
```
┌─────────────────────┐
│  Admin Panel        │
│  Material UI 3      │
├─────────────────────┤
│ 📊 Dashboard        │ ← All users
│ 👥 Users           │ ← Admin, Manager
│ 📦 Products        │ ← Admin, Manager, Editor
│ 🛒 Orders          │ ← Admin, Manager, Editor
│ 📈 Analytics       │ ← Admin, Manager, Viewer
│ ⚙️  Settings        │ ← Admin only
└─────────────────────┘
```

#### Editor Role (Limited Access)
```
┌─────────────────────┐
│  Admin Panel        │
│  Material UI 3      │
├─────────────────────┤
│ 📊 Dashboard        │
│ 📦 Products        │
│ 🛒 Orders          │
└─────────────────────┘
```

#### User Role (Minimal Access)
```
┌─────────────────────┐
│  Admin Panel        │
│  Material UI 3      │
├─────────────────────┤
│ 📊 Dashboard        │
└─────────────────────┘
```

## User Interaction Flow

### Flow 1: Switching Roles

```
1. User logs in with multiple roles
   └─> Header shows role switcher: [ผู้ดูแล ▼]

2. User clicks role switcher button
   └─> Dropdown menu opens showing all available roles

3. User clicks on "บรรณาธิการ" (Editor)
   └─> Loading spinner appears: [⟳ บรรณาธิการ]
   └─> API call to backend: PATCH /users/:id/switch-role
   └─> Backend validates and updates activeRole

4. Role switch completes
   └─> Button updates: [บรรณาธิการ ▼]
   └─> Sidebar menu filters automatically
   └─> Only Editor-accessible items are shown
```

### Flow 2: Menu Access Based on Role

```
Admin User (activeRole: 'admin')
├─> Can see: Dashboard, Users, Products, Orders, Analytics, Settings
└─> Total menu items: 6

Switch to Manager
├─> Can see: Dashboard, Users, Products, Orders, Analytics
└─> Total menu items: 5 (Settings removed)

Switch to Editor
├─> Can see: Dashboard, Products, Orders
└─> Total menu items: 3 (Users, Analytics, Settings removed)

Switch to Viewer
├─> Can see: Dashboard, Analytics
└─> Total menu items: 2 (Only view permissions)

Switch to User
├─> Can see: Dashboard
└─> Total menu items: 1 (Basic access only)
```

## Visual States

### State 1: Single Role User (No Role Switcher)
```
Header: [Dashboard]                      [EN] [🌙] [🔔] [👤]
                                          ↑
                              No role switcher visible
```

### State 2: Multi-Role User (Idle)
```
Header: [Dashboard]     [Admin ▼] [EN] [🌙] [🔔] [👤]
                           ↑
                 Role switcher showing current role
```

### State 3: Role Switching (Loading)
```
Header: [Dashboard]     [⟳ Admin] [EN] [🌙] [🔔] [👤]
                           ↑
                    Loading spinner active
                   Button is disabled
```

### State 4: Role Menu Open
```
Header: [Dashboard]     [Admin ▼] [EN] [🌙] [🔔] [👤]
                           │
                           ├────────────────┐
                           │  Switch Role   │
                           ├────────────────┤
                           │ ✓ Admin        │
                           │   Manager      │
                           │   Editor       │
                           └────────────────┘
```

## Responsive Design

The role switcher is fully responsive:

### Desktop (>600px)
- Full text label: "ผู้ดูแล" (Admin)
- Icon + Text in button
- Dropdown menu: 200px min width

### Mobile (<600px)
- Same full text label
- Compact button style
- Touch-friendly tap targets
- Menu overlays properly

## Color Coding

The current implementation uses Material UI's theme colors:

- **Active Role Button**: Primary color (blue)
- **Selected Role in Menu**: Primary color with checkmark
- **Inactive Roles**: Default text color
- **Disabled State**: Muted with loading spinner

## Accessibility

- **ARIA Labels**: All buttons have proper aria-labels
- **Keyboard Navigation**: Full keyboard support for menu
- **Screen Readers**: Role changes are announced
- **Focus Management**: Focus returns to button after menu closes
- **Color Contrast**: Meets WCAG AA standards

## Example User Scenarios

### Scenario A: Department Manager with Multiple Roles
```
User: John Doe
Roles: ['admin', 'manager', 'editor']
Active: 'manager'

Morning (Administrative tasks):
- Switches to 'admin' role
- Accesses User Management
- Updates system settings

Afternoon (Content work):
- Switches to 'editor' role
- Manages products and orders
- Cannot access user settings
```

### Scenario B: Content Creator with Limited Access
```
User: Jane Smith
Roles: ['editor']
Active: 'editor'

Visible UI:
- No role switcher (only one role)
- Menu shows: Dashboard, Products, Orders
- Cannot access: Users, Analytics, Settings
```

## Error Handling

### Error 1: Role Not in User's Roles
```
User attempts to switch to a role not assigned to them:
└─> Backend returns: 400 Bad Request
└─> Frontend shows: Alert with error message
└─> User remains in current role
```

### Error 2: Network Failure
```
API call fails during role switch:
└─> Loading spinner stops
└─> Error alert shown: "ไม่สามารถเปลี่ยนบทบาทได้"
└─> User can retry the switch
└─> Current role remains active
```

## Implementation Notes

1. **Context API**: Uses React Context for global user state
2. **Real-time Updates**: Menu filters immediately on role change
3. **Persistent State**: Current user and role saved in localStorage
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Backward Compatible**: Works with existing single-role users
