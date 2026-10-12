import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const BASE_URL = 'https://localhost:8246/products-api/1.0';

export const getAllProducts = () => axios.get(`${BASE_URL}/products`);
export const getProductById = (id: string) => axios.get(`${BASE_URL}/product/${id}`);
export const updateProductById = (id: string, product: any) => axios.put(`${BASE_URL}/product/${id}`, product);
export const deleteProductById = (id: string) => axios.delete(`${BASE_URL}/product/${id}`);
export const createProduct = (productData: any) => axios.post(`${BASE_URL}/product`, productData);
