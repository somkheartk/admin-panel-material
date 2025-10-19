// Menu configuration with role-based access control
export interface MenuItem {
  text: string;
  icon: string;
  href: string;
  roles: string[]; // Roles that can access this menu item
}

// Define which roles can access which menu items
export const menuConfig: Record<string, string[]> = {
  '/': ['admin', 'manager', 'editor', 'viewer', 'user'], // Dashboard accessible to all
  '/users': ['admin', 'manager'], // Only admin and manager can manage users
  '/products': ['admin', 'manager', 'editor'], // Admin, manager, and editor can manage products
  '/orders': ['admin', 'manager', 'editor'], // Admin, manager, and editor can manage orders
  '/analytics': ['admin', 'manager', 'viewer'], // Admin, manager, and viewer can see analytics
  '/settings': ['admin'], // Only admin can access settings
};

// Helper function to check if a user's active role can access a menu item
export function canAccessMenuItem(menuPath: string, userRole: string): boolean {
  const allowedRoles = menuConfig[menuPath];
  if (!allowedRoles) {
    return false; // If no roles defined, deny access
  }
  return allowedRoles.includes(userRole);
}

// Helper function to filter menu items based on user's active role
export function getAccessibleMenuItems(userRole: string): string[] {
  return Object.entries(menuConfig)
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([path, _]) => path);
}
