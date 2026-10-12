import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { reportMissedCall } from "../../lib/api/missedCallsHandlerApi";
import {
  FloatingButtonContainer,
  CircularButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalDescription,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  ButtonGroup,
  SuccessMessage,
  Button,
} from "../../styles/common/MissedCallsButton.styled";

const SUCCESS_TIMEOUT = 2000;
const MIN_PHONE_LENGTH = 9;
const MAX_PHONE_LENGTH = 14;

const MissedCallsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel pending request on component unmount
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const getCleanedNumber = (num: string): string => {
    return num.replace(/[\s\-().+]/g, "");
  };

  const isValidPhoneNumber = (num: string): boolean => {
    const cleaned = getCleanedNumber(num);
    const phoneRegex = new RegExp(
      `^[0-9]{${MIN_PHONE_LENGTH},${MAX_PHONE_LENGTH}}$`,
    );
    return phoneRegex.test(cleaned);
  };

  const handleClose = () => {
    setPhoneNumber("");
    setError("");
    setSuccessMessage("");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate input before making API call
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError(
        `Please enter a valid phone number. (${MIN_PHONE_LENGTH}-${MAX_PHONE_LENGTH} digits)`,
      );
      return;
    }

    // Make API call to report missed call
    try {
      setIsLoading(true);
      const cleaned = getCleanedNumber(phoneNumber);
      abortControllerRef.current = new AbortController();
      const { data, status } = await reportMissedCall(
        cleaned,
        abortControllerRef.current.signal,
      );

      if (status === 204 || (status === 200 && data.success)) {
        setSuccessMessage("Email sent successfully for missed call report.");
        setTimeout(() => handleClose(), SUCCESS_TIMEOUT);
      } else {
        setError(data.message || "Failed to process missed call report.");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request cancelled - component unmounted.");
        return;
      }
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        let message = "Failed to process missed call report.";

        if (status === 500) {
          message = "Service temporarily unavailable. Please try again later.";
        } else if (status === 404) {
          message = "Mobile number not registered in the system.";
        } else if (err.message) {
          message = err.message;
        }

        setError(message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Missed calls handler error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FloatingButtonContainer>
      <CircularButton
        onClick={() => setIsOpen(true)}
        title="Report Missed Calls"
      >
        <span
          style={{
            display: "inline-block !important" as any,
            lineHeight: "1 !important" as any,
            fontSize: "28px !important" as any,
            fontWeight: "bold !important" as any,
          }}
        >
          📞
        </span>
      </CircularButton>

      {isOpen && (
        <ModalOverlay onClick={handleClose}>
          <ModalContent
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <ModalTitle>Report Missed Call</ModalTitle>
            <ModalDescription>
              Enter your mobile number to report missed calls
            </ModalDescription>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                {successMessage && (
                  <SuccessMessage>{successMessage}</SuccessMessage>
                )}
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="077 123-4567"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPhoneNumber(e.target.value);
                    if (error) setError("");
                  }}
                  error={!!error}
                  disabled={isLoading}
                  autoFocus
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </FormGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" primary disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </FloatingButtonContainer>
  );
};

export default MissedCallsButton;
