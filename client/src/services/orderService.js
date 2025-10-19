import API from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await API.get('/orders/myorders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await API.get('/orders');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await API.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};
