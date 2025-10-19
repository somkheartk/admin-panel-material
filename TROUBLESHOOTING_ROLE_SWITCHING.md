# Role Switching Troubleshooting Guide

## Problem: Cannot Switch Roles

If you're experiencing issues with role switching (ไม่สามารถ switch role ได้), follow these steps to diagnose and fix the problem.

## Common Causes

### 1. Database Not Initialized Properly
**Symptom:** Users don't have the `roles` array or `activeRole` field in the database.

**Solution:**
```bash
# Go to backend directory
cd backend

# Run the migration script to fix existing users
npm run migrate:roles

# Or reseed the database with correct data
npm run seed
```

### 2. User Has Only One Role
**Symptom:** Role switcher button doesn't appear in the header.

**Why:** The role switcher only appears when a user has 2 or more roles.

**Solution:** Add more roles to the user in the database or through the Users management page.

### 3. Backend Not Running
**Symptom:** Network errors when trying to switch roles.

**Solution:**
```bash
# Start the backend server
cd backend
npm run dev
```

The backend should be running on `http://localhost:3001`

### 4. MongoDB Not Running
**Symptom:** Backend crashes or shows MongoDB connection errors.

**Solution:**
```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 5. User Roles Array Empty or Missing
**Symptom:** Error message says "Role is not assigned to this user"

**Solution:** Use the migration script to fix:
```bash
cd backend
npm run migrate:roles
```

## Verification Steps

### Step 1: Check User Data in Database
```javascript
// In MongoDB shell
use admin-panel
db.users.find().pretty()

// Check that each user has:
// - roles: ["role1", "role2", ...]
// - activeRole: "role1"
```

### Step 2: Check Backend Logs
When switching roles, the backend should log:
```
Switching role for user <id>: {
  currentRoles: [...],
  currentActiveRole: "...",
  requestedRole: "..."
}
Successfully switched role for user <id> to <role>
```

### Step 3: Check Frontend Console
When switching roles, the browser console should show:
```
UserContext: Switching role from <old> to <new>
User roles: [...]
UserContext: Role switched successfully, updated user: {...}
```

## Expected Database Structure

Each user document should have:
```javascript
{
  "_id": "...",
  "name": "User Name",
  "email": "user@example.com",
  "status": "active",
  "roles": ["admin", "manager", "editor"],  // Array of roles
  "activeRole": "admin",                    // Current active role
  "role": "admin"                           // Backward compatibility (optional)
}
```

## Frontend Requirements

1. **UserProvider must wrap the app** - Check `app/layout.tsx`:
```typescript
<UserProvider>
  <LanguageProvider>
    {children}
  </LanguageProvider>
</UserProvider>
```

2. **User must have multiple roles** - The role switcher only shows if `user.roles.length > 1`

3. **Backend must be accessible** - Frontend expects backend at `http://localhost:3001`

## Testing Role Switching

### Test with Sample Users
The seed data includes users with multiple roles:

1. **สมชาย ใจดี** (somchai@example.com)
   - Roles: `['admin', 'manager']`
   - Can switch between admin and manager

2. **สมหญิง รักดี** (somying@example.com)
   - Roles: `['editor', 'viewer']`
   - Can switch between editor and viewer

3. **ประเสริฐ สุขใจ** (prasert@example.com)
   - Roles: `['manager', 'viewer']`
   - Can switch between manager and viewer

### Manual Test Steps
1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Open browser to `http://localhost:3000`
4. Look for role switcher button in header (next to language toggle)
5. Click the button to see available roles
6. Select a different role
7. Verify menu items update according to the new role

## Role-Based Menu Access

| Menu Item   | Admin | Manager | Editor | Viewer | User |
|-------------|-------|---------|--------|--------|------|
| Dashboard   | ✅    | ✅      | ✅     | ✅     | ✅   |
| Users       | ✅    | ✅      | ❌     | ❌     | ❌   |
| Products    | ✅    | ✅      | ✅     | ❌     | ❌   |
| Orders      | ✅    | ✅      | ✅     | ❌     | ❌   |
| Analytics   | ✅    | ✅      | ❌     | ✅     | ❌   |
| Settings    | ✅    | ❌      | ❌     | ❌     | ❌   |

## Error Messages and Solutions

### "Role 'X' is not assigned to this user"
**Cause:** The requested role is not in the user's `roles` array.

**Solution:**
1. Run migration: `npm run migrate:roles`
2. Or manually update the user in database to include the role in the `roles` array

### "Cannot switch role: No current user"
**Cause:** User is not loaded in the frontend.

**Solution:**
1. Check if UserProvider is properly set up
2. Check browser console for errors loading user
3. Verify backend is running and accessible

### "Network Error" or "ECONNREFUSED"
**Cause:** Backend is not running or not accessible.

**Solution:**
1. Start backend: `cd backend && npm run dev`
2. Check backend URL in `.env` or environment variables
3. Verify CORS is properly configured

## Quick Fix Commands

```bash
# Complete reset and setup
cd backend
npm install
npm run seed          # Seed database with test data
cd ..
npm install
npm run dev           # Start frontend

# In another terminal
cd backend
npm run dev           # Start backend

# If issues persist, run migration
cd backend
npm run migrate:roles
```

## Contact Support

If you still have issues after following this guide:
1. Check the browser console for errors (F12 → Console)
2. Check the backend logs for errors
3. Verify MongoDB is running and connected
4. Review the test files in `lib/__tests__` and `backend/src/**/*.spec.ts` for examples

## Related Documentation

- `ROLE_SWITCHING_IMPLEMENTATION.md` - Technical implementation details
- `ROLE_SWITCHING_UI_GUIDE.md` - UI component guide
- `ROLE_SWITCHING_EXAMPLES.md` - Code examples
- `README_ROLE_SWITCHING.md` - Feature overview
