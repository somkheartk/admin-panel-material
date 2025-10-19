import apiClient from './client';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  roles: string[];
  activeRole: string;
  // Keep for backward compatibility
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  status?: string;
  roles?: string[];
  activeRole?: string;
  // Keep for backward compatibility
  role?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  roles?: string[];
  activeRole?: string;
  // Keep for backward compatibility
  role?: string;
}

export interface SwitchRoleDto {
  activeRole: string;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await apiClient.get('/users/count');
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  switchRole: async (id: string, data: SwitchRoleDto): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/switch-role`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
