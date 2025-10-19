import apiClient from './client';

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  product: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  orderNumber: string;
  customerName: string;
  product: string;
  amount: number;
  status?: string;
  description?: string;
}

export interface UpdateOrderDto {
  orderNumber?: string;
  customerName?: string;
  product?: string;
  amount?: number;
  status?: string;
  description?: string;
}

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await apiClient.get('/orders/count');
    return response.data;
  },

  getRevenue: async (): Promise<number> => {
    const response = await apiClient.get('/orders/revenue');
    return response.data;
  },

  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  update: async (id: string, data: UpdateOrderDto): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },
};
