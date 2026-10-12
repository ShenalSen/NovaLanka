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

/* ── Product grid ── */
export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
`;

export const ProductCard = styled.div<{ selected: boolean }>`
  background: #ffffff;
  border: 2px solid ${p => p.selected ? '#6C5CE7' : '#e2e8f0'};
  border-radius: 14px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${p => p.selected
    ? '0 0 0 4px rgba(108, 92, 231, 0.12), 0 4px 16px rgba(0,0,0,0.06)'
    : '0 2px 8px rgba(0,0,0,0.04)'};
  position: relative;

  &:hover {
    border-color: #6C5CE7;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.12);
  }
`;

export const ProductCardBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  background: #6C5CE7;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 20px;
  padding: 2px 10px;
`;

export const ProductCardName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  padding-right: 56px;
`;

export const ProductCardDesc = styled.p`
  font-size: 0.88rem;
  color: #718096;
  line-height: 1.5;
`;

export const ProductCardCoverage = styled.div`
  margin-top: 14px;
  font-size: 0.82rem;
  color: #6C5CE7;
  font-weight: 500;
`;

/* ── Details form ── */
export const FormCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 40px 48px;
  width: 100%;
  max-width: 700px;
`;

export const SelectedProductBanner = styled.div`
  background: linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%);
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SelectedProductName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
`;

export const ChangePlanLink = styled.button`
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.3); }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
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

  &:focus {
    border-color: ${p => p.hasError ? '#ef4444' : '#6C5CE7'};
    background: #ffffff;
  }

  &:disabled {
    background: #f0f0f0;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

export const FormSelect = styled.select<{ hasError?: boolean }>`
  height: 44px;
  border: 1.5px solid ${p => p.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  padding: 0 14px;
  font-size: 0.95rem;
  color: #1a202c;
  outline: none;
  background: #fafafa;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;

  &:focus { border-color: #6C5CE7; background-color: #ffffff; }
`;

export const FieldError = styled.span`
  font-size: 0.78rem;
  color: #ef4444;
`;

export const FieldHint = styled.span`
  font-size: 0.78rem;
  color: #9ca3af;
`;

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

  &:hover { background: #f9fafb; border-color: #9ca3af; }
`;

/* ── Quote result ── */
export const ResultCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 40px 48px;
  width: 100%;
  max-width: 700px;
  animation: ${fadeInUp} 0.35s ease-out;
`;

export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const ResultIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6C5CE7 0%, #7d6ef9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

export const ResultTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
`;

export const ResultSubtitle = styled.p`
  font-size: 0.88rem;
  color: #718096;
`;

export const PremiumHighlight = styled.div`
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border: 1px solid #ddd6fe;
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 24px;
  text-align: center;
`;

export const PremiumLabel = styled.p`
  font-size: 0.85rem;
  color: #7c3aed;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const PremiumAmount = styled.p`
  font-size: 2.4rem;
  font-weight: 800;
  color: #5b21b6;
  line-height: 1;
  margin-bottom: 4px;
`;

export const PremiumFrequency = styled.span`
  font-size: 0.9rem;
  color: #7c3aed;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 28px;
  margin-bottom: 28px;
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const DetailLabel = styled.span`
  font-size: 0.78rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
`;

export const DetailValue = styled.span`
  font-size: 0.95rem;
  color: #1a202c;
  font-weight: 500;
`;

export const QuoteIdBadge = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e0;
  border-radius: 8px;
  padding: 10px 16px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const CopyButton = styled.button`
  background: none;
  border: none;
  color: #6C5CE7;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover { background: #ede9fe; }
`;

export const ValidUntilNote = styled.p`
  font-size: 0.82rem;
  color: #f59e0b;
  text-align: center;
  margin-bottom: 24px;
`;

export const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 14px 18px;
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 20px;
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
