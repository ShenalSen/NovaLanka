import { createApiClient } from './apiClient';

export type AddressVerificationResponse = {
  valid: boolean;
  display_name: string;
};

const apiClient = createApiClient('/addressverification-api/1.0');

export const verifyAddress = async (address: string) => {
  try {
    return (await apiClient.post('/address', { address })).data;
  } catch {
    return { valid: false, display_name: '' };
  }
};
