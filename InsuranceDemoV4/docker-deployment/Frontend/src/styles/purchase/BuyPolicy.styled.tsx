import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Page shell ── */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%);
  font-family: 'Poppins', Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
`;

export const TopBarTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
`;

export const BackButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Poppins', Arial, sans-serif;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

export const StepHeading = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  text-align: center;
`;

export const StepSubheading = styled.p`
  font-size: 1rem;
  color: #718096;
  margin-bottom: 36px;
  text-align: center;
`;

/* ── Stepper ── */
export const StepperRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 40px;
`;

export const StepDot = styled.div<{ active: boolean; done: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${p => p.done ? '#6C5CE7' : p.active ? '#6C5CE7' : '#e2e8f0'};
  color: ${p => (p.done || p.active) ? '#ffffff' : '#a0aec0'};
  transition: all 0.3s;
`;

export const StepLabel = styled.span<{ active: boolean }>`
  font-size: 0.78rem;
  color: ${p => p.active ? '#6C5CE7' : '#a0aec0'};
  font-weight: ${p => p.active ? '600' : '400'};
  margin-top: 4px;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StepConnector = styled.div<{ done: boolean }>`
  width: 60px;
  height: 2px;
  background: ${p => p.done ? '#6C5CE7' : '#e2e8f0'};
  margin: 0 4px;
  margin-bottom: 20px;
  transition: background 0.3s;
`;

/* ── Cards ── */
export const FormCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 40px 48px;
  width: 100%;
  max-width: 700px;
  animation: ${fadeInUp} 0.35s ease-out;

  @media (max-width: 600px) {
    padding: 28px 20px;
  }
`;

/* ── Quote lookup ── */
export const QuoteLookupWrapper = styled.div`
  width: 100%;
  max-width: 500px;
`;

export const QuoteInputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

export const QuoteSummaryCard = styled.div`
  background: linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%);
  border-radius: 14px;
  padding: 24px 28px;
  margin-top: 24px;
  animation: ${fadeInUp} 0.3s ease-out;
`;

export const QuoteSummaryTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
`;

export const QuoteSummaryName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
`;

export const QuoteSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const QuoteSummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const QuoteSummaryLabel = styled.span`
  font-size: 0.72rem;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const QuoteSummaryValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
`;

export const ExpiredBanner = styled.div`
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  padding: 18px 22px;
  margin-top: 20px;
  text-align: center;
  animation: ${fadeInUp} 0.3s ease-out;
`;

export const ExpiredTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #c2410c;
  margin-bottom: 6px;
`;

export const ExpiredText = styled.div`
  font-size: 0.88rem;
  color: #7c2d12;
  margin-bottom: 14px;
`;

/* ── Form fields ── */
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGridFull = styled.div`
  grid-column: 1 / -1;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FormLabel = styled.label`
  font-size: 0.88rem;
  font-weight: 500;
  color: #374151;
`;

export const FormInput = styled.input<{ hasError?: boolean }>`
  height: 44px;
  border: 1.5px solid ${p => p.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  padding: 0 14px;
  font-size: 0.95rem;
  color: #1a202c;
  outline: none;
  transition: border-color 0.2s;
  background: #fafafa;
  font-family: 'Poppins', Arial, sans-serif;

  &:focus {
    border-color: ${p => p.hasError ? '#ef4444' : '#6C5CE7'};
    background: #ffffff;
  }

  &:disabled {
    background: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

export const ReadOnlyField = styled.div`
  height: 44px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 0.95rem;
  color: #374151;
  background: #f9fafb;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

export const FieldError = styled.span`
  font-size: 0.78rem;
  color: #ef4444;
`;

export const FieldHint = styled.span`
  font-size: 0.78rem;
  color: #9ca3af;
`;

export const SectionDivider = styled.div`
  border-top: 1px solid #f0f0f0;
  margin: 28px 0 24px;
`;

export const SectionTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* ── Payment method selector ── */
export const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const PaymentMethodCard = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid ${p => p.selected ? '#6C5CE7' : '#e2e8f0'};
  border-radius: 12px;
  background: ${p => p.selected ? '#f5f3ff' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', Arial, sans-serif;

  &:hover {
    border-color: #6C5CE7;
    background: #f5f3ff;
  }
`;

export const PaymentMethodIcon = styled.span`
  font-size: 1.6rem;
`;

export const PaymentMethodLabel = styled.span<{ selected: boolean }>`
  font-size: 0.85rem;
  font-weight: ${p => p.selected ? '600' : '500'};
  color: ${p => p.selected ? '#6C5CE7' : '#374151'};
`;

export const ExternalPaymentInfo = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 0.88rem;
  color: #92400e;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

/* ── Card form ── */
export const CardFormWrapper = styled.div`
  background: #f8faff;
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-top: 4px;
  animation: ${fadeInUp} 0.25s ease-out;
`;

export const CardNumberInput = styled(FormInput)`
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
`;

/* ── Buttons ── */
export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Poppins', Arial, sans-serif;

  &:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(108, 92, 231, 0.35); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

export const SecondaryButton = styled.button`
  background: #ffffff;
  color: #4a5568;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', Arial, sans-serif;

  &:hover { background: #f9fafb; border-color: #9ca3af; }
`;

export const ExternalLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(108, 92, 231, 0.35); }
`;

/* ── Error banner ── */
export const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 14px 18px;
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

/* ── Success screen ── */
export const SuccessWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  animation: ${fadeInUp} 0.4s ease-out;
`;

export const SuccessCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 48px 48px 40px;
  text-align: center;

  @media (max-width: 600px) {
    padding: 32px 20px;
  }
`;

export const SuccessIconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
`;

export const SuccessTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
`;

export const SuccessSubtitle = styled.p`
  font-size: 0.95rem;
  color: #718096;
  margin-bottom: 32px;
`;

export const SuccessDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  text-align: left;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SuccessDetailItem = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px 16px;
`;

export const SuccessDetailLabel = styled.div`
  font-size: 0.72rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  margin-bottom: 4px;
`;

export const SuccessDetailValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a202c;
`;

export const PolicyIdBadge = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  font-family: monospace;
  font-size: 1rem;
  color: #166534;
  font-weight: 600;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
