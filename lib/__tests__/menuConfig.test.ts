import { canAccessMenuItem, getAccessibleMenuItems, menuConfig } from '../menuConfig';

describe('menuConfig', () => {
  describe('menuConfig structure', () => {
    it('should define access rules for all menu items', () => {
      expect(menuConfig['/']).toBeDefined();
      expect(menuConfig['/users']).toBeDefined();
      expect(menuConfig['/products']).toBeDefined();
      expect(menuConfig['/orders']).toBeDefined();
      expect(menuConfig['/analytics']).toBeDefined();
      expect(menuConfig['/settings']).toBeDefined();
    });

    it('should allow all roles to access dashboard', () => {
      expect(menuConfig['/']).toContain('admin');
      expect(menuConfig['/']).toContain('manager');
      expect(menuConfig['/']).toContain('editor');
      expect(menuConfig['/']).toContain('viewer');
      expect(menuConfig['/']).toContain('user');
    });

    it('should restrict users management to admin and manager', () => {
      expect(menuConfig['/users']).toEqual(['admin', 'manager']);
    });

    it('should restrict settings to admin only', () => {
      expect(menuConfig['/settings']).toEqual(['admin']);
    });
  });

  describe('canAccessMenuItem', () => {
    it('should return true for admin accessing any menu item', () => {
      expect(canAccessMenuItem('/', 'admin')).toBe(true);
      expect(canAccessMenuItem('/users', 'admin')).toBe(true);
      expect(canAccessMenuItem('/products', 'admin')).toBe(true);
      expect(canAccessMenuItem('/orders', 'admin')).toBe(true);
      expect(canAccessMenuItem('/analytics', 'admin')).toBe(true);
      expect(canAccessMenuItem('/settings', 'admin')).toBe(true);
    });

    it('should return false for user role accessing restricted items', () => {
      expect(canAccessMenuItem('/', 'user')).toBe(true);
      expect(canAccessMenuItem('/users', 'user')).toBe(false);
      expect(canAccessMenuItem('/products', 'user')).toBe(false);
      expect(canAccessMenuItem('/orders', 'user')).toBe(false);
      expect(canAccessMenuItem('/analytics', 'user')).toBe(false);
      expect(canAccessMenuItem('/settings', 'user')).toBe(false);
    });

    it('should return correct access for editor role', () => {
      expect(canAccessMenuItem('/', 'editor')).toBe(true);
      expect(canAccessMenuItem('/users', 'editor')).toBe(false);
      expect(canAccessMenuItem('/products', 'editor')).toBe(true);
      expect(canAccessMenuItem('/orders', 'editor')).toBe(true);
      expect(canAccessMenuItem('/analytics', 'editor')).toBe(false);
      expect(canAccessMenuItem('/settings', 'editor')).toBe(false);
    });

    it('should return correct access for viewer role', () => {
      expect(canAccessMenuItem('/', 'viewer')).toBe(true);
      expect(canAccessMenuItem('/users', 'viewer')).toBe(false);
      expect(canAccessMenuItem('/products', 'viewer')).toBe(false);
      expect(canAccessMenuItem('/orders', 'viewer')).toBe(false);
      expect(canAccessMenuItem('/analytics', 'viewer')).toBe(true);
      expect(canAccessMenuItem('/settings', 'viewer')).toBe(false);
    });

    it('should return correct access for manager role', () => {
      expect(canAccessMenuItem('/', 'manager')).toBe(true);
      expect(canAccessMenuItem('/users', 'manager')).toBe(true);
      expect(canAccessMenuItem('/products', 'manager')).toBe(true);
      expect(canAccessMenuItem('/orders', 'manager')).toBe(true);
      expect(canAccessMenuItem('/analytics', 'manager')).toBe(true);
      expect(canAccessMenuItem('/settings', 'manager')).toBe(false);
    });

    it('should return false for undefined menu paths', () => {
      expect(canAccessMenuItem('/nonexistent', 'admin')).toBe(false);
      expect(canAccessMenuItem('/unknown', 'user')).toBe(false);
    });
  });

  describe('getAccessibleMenuItems', () => {
    it('should return all menu items for admin', () => {
      const accessibleItems = getAccessibleMenuItems('admin');
      expect(accessibleItems).toContain('/');
      expect(accessibleItems).toContain('/users');
      expect(accessibleItems).toContain('/products');
      expect(accessibleItems).toContain('/orders');
      expect(accessibleItems).toContain('/analytics');
      expect(accessibleItems).toContain('/settings');
      expect(accessibleItems.length).toBe(6);
    });

    it('should return only dashboard for user role', () => {
      const accessibleItems = getAccessibleMenuItems('user');
      expect(accessibleItems).toEqual(['/']);
      expect(accessibleItems.length).toBe(1);
    });

    it('should return correct items for editor role', () => {
      const accessibleItems = getAccessibleMenuItems('editor');
      expect(accessibleItems).toContain('/');
      expect(accessibleItems).toContain('/products');
      expect(accessibleItems).toContain('/orders');
      expect(accessibleItems).not.toContain('/users');
      expect(accessibleItems).not.toContain('/settings');
      expect(accessibleItems).not.toContain('/analytics');
      expect(accessibleItems.length).toBe(3);
    });

    it('should return correct items for viewer role', () => {
      const accessibleItems = getAccessibleMenuItems('viewer');
      expect(accessibleItems).toContain('/');
      expect(accessibleItems).toContain('/analytics');
      expect(accessibleItems).not.toContain('/users');
      expect(accessibleItems).not.toContain('/products');
      expect(accessibleItems).not.toContain('/orders');
      expect(accessibleItems).not.toContain('/settings');
      expect(accessibleItems.length).toBe(2);
    });

    it('should return correct items for manager role', () => {
      const accessibleItems = getAccessibleMenuItems('manager');
      expect(accessibleItems).toContain('/');
      expect(accessibleItems).toContain('/users');
      expect(accessibleItems).toContain('/products');
      expect(accessibleItems).toContain('/orders');
      expect(accessibleItems).toContain('/analytics');
      expect(accessibleItems).not.toContain('/settings');
      expect(accessibleItems.length).toBe(5);
    });
  });
});
