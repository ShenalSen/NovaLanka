import React from 'react';

export interface WizardStep {
  key: string;
  label: string;
}

interface WizardStepperProps {
  steps: readonly WizardStep[];
  currentStepIndex: number;
  /** Styled components injected by the caller so each page shell keeps its own theme */
  StepperRow: React.ElementType;
  StepItem: React.ElementType;
  StepDot: React.ElementType<{ active: boolean; done: boolean; children?: React.ReactNode }>;
  StepLabel: React.ElementType<{ active: boolean; children?: React.ReactNode }>;
  StepConnector: React.ElementType<{ done: boolean }>;
}

const WizardStepper: React.FC<WizardStepperProps> = ({
  steps, currentStepIndex,
  StepperRow, StepItem, StepDot, StepLabel, StepConnector,
}) => (
  <StepperRow>
    {steps.map((s, i) => (
      <React.Fragment key={s.key}>
        <StepItem>
          <StepDot active={i === currentStepIndex} done={i < currentStepIndex}>
            {i < currentStepIndex ? '✓' : i + 1}
          </StepDot>
          <StepLabel active={i === currentStepIndex}>{s.label}</StepLabel>
        </StepItem>
        {i < steps.length - 1 && (
          <StepConnector done={i < currentStepIndex} />
        )}
      </React.Fragment>
    ))}
  </StepperRow>
);

export default WizardStepper;
