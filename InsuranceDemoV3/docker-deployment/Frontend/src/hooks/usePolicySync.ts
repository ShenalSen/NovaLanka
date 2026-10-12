import { useState } from "react";
import { triggerPolicySync } from "../lib/api/syncControllerApi";
import { useErrorHandler } from "./useErrorHandler";

const SYNC_MESSAGE_TIMEOUT = 3000;

export const usePolicySync = () => {
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const { getErrorMessage } = useErrorHandler();

  // Function to trigger the policy synchronization batch job
  const handleRunBatchJob = async () => {
    try {
      setSyncLoading(true);
      setSyncMessage(null);
      const { data } = await triggerPolicySync();
      setSyncMessage(data.message || "Policy sync completed successfully!");
      setTimeout(() => setSyncMessage(null), SYNC_MESSAGE_TIMEOUT);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setSyncMessage(`Error: ${errorMsg}`);
      setTimeout(() => setSyncMessage(null), SYNC_MESSAGE_TIMEOUT);
    } finally {
      setSyncLoading(false);
    }
  };

  return { syncLoading, syncMessage, handleRunBatchJob };
};
