import axios from "axios";

export const useErrorHandler = () => {
  // Error handling with specific messages based on API response
  const getErrorMessage = (error: any): string => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const details = error.response?.data?.details;
      const errorMsg = error.response?.data?.error;

      if (status === 500) {
        return "Service temporarily unavailable. Please try again later.";
      }
      if (status === 401) {
        return "Authentication failed. Please log in again.";
      }
      return details || errorMsg || error.message || "An error occurred";
    }
    return "An unexpected error occurred";
  };

  return { getErrorMessage };
};
