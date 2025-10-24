import API from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    // Remove Content-Type header for FormData so axios can set it with boundary
    const config = productData instanceof FormData
      ? { headers: { 'Content-Type': undefined } }
      : undefined;
    const response = await API.post('/products', productData, config);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    // Remove Content-Type header for FormData so axios can set it with boundary
    const config = productData instanceof FormData
      ? { headers: { 'Content-Type': undefined } }
      : undefined;
    const response = await API.put(`/products/${id}`, productData, config);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  }
};
