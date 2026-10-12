import axios from 'axios';

const BASE_URL = 'https://localhost:8246/employee-api/1.0';

export const getAllEmployees = () => axios.get(`${BASE_URL}/employees`);
export const getEmployeeById = (id: string) => axios.get(`${BASE_URL}/employee/${id}`);
export const updateEmployeeById = (id: string, payload: any) => axios.put(`${BASE_URL}/employee/${id}`, payload);
export const deleteEmployeeById = (id: string) => axios.delete(`${BASE_URL}/employee/${id}`);
export const createEmployee = (employeeData: any) => axios.post(`${BASE_URL}/employee`, { employee: employeeData });