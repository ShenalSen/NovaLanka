import { createApiClient } from './apiClient';

const apiClient = createApiClient('/products-api/1.0');

export const getAllProducts = () => apiClient.get(`/products`);
export const getProductById = (id: string) => apiClient.get(`/product/${id}`);
export const updateProductById = (id: string, product: any) => apiClient.put(`/product/${id}`, product);
export const deleteProductById = (id: string) => apiClient.delete(`/product/${id}`);
export const createProduct = (productData: any) => apiClient.post(`/product`, productData);
