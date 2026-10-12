import { useState, useCallback, useRef } from "react";
import { verifyAddress } from "../lib/api/addressVerificationApi";
import type { AddressVerificationResponse } from "../lib/api/addressVerificationApi";

type UseAddressValidationResult = {
  isValidating: boolean;
  validationResult: AddressVerificationResponse | null;
  validateAddress: (address: string) => Promise<AddressVerificationResponse>;
  resetValidation: () => void;
};

const DEFAULT_RESULT: AddressVerificationResponse = {
  valid: false,
  display_name: "",
};

export const useAddressValidation = (): UseAddressValidationResult => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<AddressVerificationResponse | null>(null);
  const cache = useRef<Record<string, AddressVerificationResponse>>({});

  const validateAddress = useCallback(
    async (address: string): Promise<AddressVerificationResponse> => {
      const normalizedAddress = address.trim().toLowerCase();
      if (!normalizedAddress) {
        setValidationResult(DEFAULT_RESULT);
        return DEFAULT_RESULT;
      }

      if (cache.current[normalizedAddress]) {
        setValidationResult(cache.current[normalizedAddress]);
        return cache.current[normalizedAddress];
      }

      setIsValidating(true);
      try {
        const result = await verifyAddress(address);
        cache.current[normalizedAddress] = result;
        setValidationResult(result);
        return result;
      } catch (error) {
        console.error("Error in address validation:", error);
        setValidationResult(DEFAULT_RESULT);
        return DEFAULT_RESULT;
      } finally {
        setIsValidating(false);
      }
    },
    [],
  );

  return {
    isValidating,
    validationResult,
    validateAddress,
    resetValidation: useCallback(() => setValidationResult(null), []),
  };
};
