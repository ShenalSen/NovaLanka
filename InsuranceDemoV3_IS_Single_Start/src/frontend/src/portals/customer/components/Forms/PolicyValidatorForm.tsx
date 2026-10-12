import React, { useState } from "react";
import axios from "axios";
import { validatePolicy } from "../../../../lib/api/validatePolicyApi";
import type { ValidatePolicyResponse } from "../../../../lib/api/validatePolicyApi";
import * as S from "../../../../styles/Forms/customer/PolicyValidatorForm.styled";

interface PolicyValidatorFormProps {
  onCancel: () => void;
}

const PolicyValidatorForm: React.FC<PolicyValidatorFormProps> = ({
  onCancel,
}) => {
  const [policyId, setPolicyId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidatePolicyResponse | null>(null);

  // Validate policy ID format in real-time as user types
  const validatePolicyIdFormat = (id: string): boolean => {
    const policyIdRegex = /^POL_\d{3,}$/;
    return policyIdRegex.test(id);
  };

  const sanitizePolicyId = (input: string): string => {
    return input.trim().toUpperCase();
  };

  const validatePolicyIdInput = (id: string): string => {
    if (!id || !id.trim()) {
      return "Policy ID is required.";
    }
    if (!validatePolicyIdFormat(id)) {
      return "Policy ID format must be POL_ followed by numbers. (e.g., POL_001)";
    }
    return "";
  };

  // Error handling with specific messages based on API response
  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const details = err.response?.data?.details;
      const errorMsg = err.response?.data?.error;

      switch (status) {
        case 400:
          return (
            details ||
            "Invalid request. Please check the information and try again."
          );
        case 404:
          return "Policy not found. Please verify the policy ID and try again.";
        case 500:
          return "Service error. Please try again later.";
        case 503:
          return "Service temporarily unavailable due to data sync. Please try again in a moment.";
        default:
          return errorMsg || err.message || "Failed to validate policy.";
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationResult(null);

    // Validate format before API call
    const validationError = validatePolicyIdInput(policyId);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const response = await validatePolicy(policyId);

      if (response.data) {
        setValidationResult(response.data);
        if (response.data.valid === 0) {
          setError(response.data.message || "Policy validation failed.");
        }
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Policy validation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.FormOverlay onClick={onCancel}>
      <S.FormContainer
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <S.FormHeader>
          <S.FormTitle>Validate Policy</S.FormTitle>
          <S.CloseButton onClick={onCancel}>×</S.CloseButton>
        </S.FormHeader>

        <S.FormContent>
          <S.FormDescription>
            Enter your policy ID to validate your policy details
          </S.FormDescription>

          <form onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.Label htmlFor="policyId">Policy ID</S.Label>
              <S.Input
                id="policyId"
                type="text"
                placeholder="POL_001"
                value={policyId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const sanitized = sanitizePolicyId(e.target.value);
                  setPolicyId(sanitized);
                  // Real-time validation
                  const validationError = validatePolicyIdInput(sanitized);
                  setError(validationError);
                }}
                disabled={isLoading}
                autoFocus
              />
            </S.FormGroup>

            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            {validationResult && validationResult.valid === 1 && (
              <S.SuccessMessage>✓ {validationResult.message}</S.SuccessMessage>
            )}

            <S.ButtonGroup>
              <S.Button type="button" onClick={onCancel} disabled={isLoading}>
                Cancel
              </S.Button>
              <S.SubmitButton type="submit" disabled={isLoading || !!error}>
                {isLoading ? "Validating..." : "Validate Policy"}
              </S.SubmitButton>
            </S.ButtonGroup>
          </form>
        </S.FormContent>
      </S.FormContainer>
    </S.FormOverlay>
  );
};

export default PolicyValidatorForm;
