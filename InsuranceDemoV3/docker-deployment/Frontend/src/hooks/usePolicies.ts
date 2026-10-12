import { useState, useEffect } from "react";
import { getAllPolicies, deletePolicyById } from "../lib/api/policiesApi";

export interface Policy {
  policy_id: string;
  customer_id: string;
  product_id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  status: string;
  policy_details: string;
}

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all policies on component mount
  useEffect(() => {
    setLoading(true);
    getAllPolicies()
      .then((res) => {
        setPolicies(res.data.Policies?.Policy || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch policies.");
        setLoading(false);
      });
  }, []);

  // Function to delete a policy by ID
  const deletePolicy = async (policy_id: string) => {
    try {
      await deletePolicyById(policy_id);
      setPolicies((prev) => prev.filter((p) => p.policy_id !== policy_id));
    } catch {
      setError("Failed to delete policy.");
    }
  };

  return { policies, loading, error, deletePolicy, setError };
};
