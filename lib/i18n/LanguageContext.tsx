'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'th' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation object
const translations: Record<Language, any> = {
  th: {
    common: {
      dashboard: 'แดชบอร์ด',
      users: 'ผู้ใช้',
      products: 'สินค้า',
      orders: 'คำสั่งซื้อ',
      analytics: 'การวิเคราะห์',
      settings: 'การตั้งค่า',
      profile: 'โปรไฟล์',
      logout: 'ออกจากระบบ',
      add: 'เพิ่ม',
      edit: 'แก้ไข',
      delete: 'ลบ',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      search: 'ค้นหา',
      loading: 'กำลังโหลด...',
      noData: 'ไม่มีข้อมูล',
      actions: 'จัดการ',
      status: 'สถานะ',
      active: 'ใช้งาน',
      inactive: 'ไม่ใช้งาน',
      name: 'ชื่อ',
      email: 'อีเมล',
      phone: 'เบอร์โทร',
    },
    header: {
      title: 'แดชบอร์ด',
      profile: 'โปรไฟล์',
      settings: 'การตั้งค่า',
      logout: 'ออกจากระบบ',
    },
    sidebar: {
      adminPanel: 'Admin Panel',
      materialUI: 'Material UI 3',
    },
    dashboard: {
      title: 'แดชบอร์ด',
      totalUsers: 'ผู้ใช้ทั้งหมด',
      totalProducts: 'สินค้าทั้งหมด',
      totalOrders: 'คำสั่งซื้อทั้งหมด',
      totalRevenue: 'รายได้รวม',
      revenueOverview: 'ภาพรวมรายได้',
      recentActivity: 'กิจกรรมล่าสุด',
      recentUsers: 'ผู้ใช้ล่าสุด',
      recentOrders: 'คำสั่งซื้อล่าสุด',
      newUser: 'ผู้ใช้ใหม่',
      newOrder: 'คำสั่งซื้อใหม่',
    },
    users: {
      title: 'จัดการผู้ใช้',
      addNew: 'เพิ่มผู้ใช้ใหม่',
      editUser: 'แก้ไขผู้ใช้',
      allRoles: 'บทบาททั้งหมด',
      currentRole: 'บทบาทปัจจุบัน',
      switchRole: 'สลับบทบาท',
      selectRoles: 'เลือกบทบาท',
      deleteConfirm: 'คุณต้องการลบผู้ใช้นี้หรือไม่?',
      errorLoad: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
      errorSave: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      errorDelete: 'ไม่สามารถลบผู้ใช้ได้',
      errorSwitchRole: 'ไม่สามารถเปลี่ยนบทบาทได้',
    },
    products: {
      title: 'จัดการสินค้า',
      addNew: 'เพิ่มสินค้าใหม่',
      editProduct: 'แก้ไขสินค้า',
      price: 'ราคา',
      stock: 'สต็อก',
      category: 'หมวดหมู่',
      description: 'คำอธิบาย',
      deleteConfirm: 'คุณต้องการลบสินค้านี้หรือไม่?',
    },
    orders: {
      title: 'จัดการคำสั่งซื้อ',
      addNew: 'เพิ่มคำสั่งซื้อใหม่',
      editOrder: 'แก้ไขคำสั่งซื้อ',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      customer: 'ลูกค้า',
      amount: 'จำนวนเงิน',
      deleteConfirm: 'คุณต้องการลบคำสั่งซื้อนี้หรือไม่?',
      pending: 'รอดำเนินการ',
      completed: 'เสร็จสิ้น',
      cancelled: 'ยกเลิก',
    },
    roles: {
      user: 'ผู้ใช้',
      admin: 'ผู้ดูแล',
      editor: 'บรรณาธิการ',
      viewer: 'ผู้ชม',
      manager: 'ผู้จัดการ',
    },
  },
  en: {
    common: {
      dashboard: 'Dashboard',
      users: 'Users',
      products: 'Products',
      orders: 'Orders',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      loading: 'Loading...',
      noData: 'No data available',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
    },
    header: {
      title: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
    sidebar: {
      adminPanel: 'Admin Panel',
      materialUI: 'Material UI 3',
    },
    dashboard: {
      title: 'Dashboard',
      totalUsers: 'Total Users',
      totalProducts: 'Total Products',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      revenueOverview: 'Revenue Overview',
      recentActivity: 'Recent Activity',
      recentUsers: 'Recent Users',
      recentOrders: 'Recent Orders',
      newUser: 'New User',
      newOrder: 'New Order',
    },
    users: {
      title: 'User Management',
      addNew: 'Add New User',
      editUser: 'Edit User',
      allRoles: 'All Roles',
      currentRole: 'Current Role',
      switchRole: 'Switch Role',
      selectRoles: 'Select Roles',
      deleteConfirm: 'Are you sure you want to delete this user?',
      errorLoad: 'Failed to load users',
      errorSave: 'Failed to save user',
      errorDelete: 'Failed to delete user',
      errorSwitchRole: 'Failed to switch role',
    },
    products: {
      title: 'Product Management',
      addNew: 'Add New Product',
      editProduct: 'Edit Product',
      price: 'Price',
      stock: 'Stock',
      category: 'Category',
      description: 'Description',
      deleteConfirm: 'Are you sure you want to delete this product?',
    },
    orders: {
      title: 'Order Management',
      addNew: 'Add New Order',
      editOrder: 'Edit Order',
      orderNumber: 'Order Number',
      customer: 'Customer',
      amount: 'Amount',
      deleteConfirm: 'Are you sure you want to delete this order?',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    roles: {
      user: 'User',
      admin: 'Admin',
      editor: 'Editor',
      viewer: 'Viewer',
      manager: 'Manager',
    },
  },
};
