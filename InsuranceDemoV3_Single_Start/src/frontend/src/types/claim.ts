export interface ClaimFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  policyId: string;
  policyType: string;
  address: string;
  incidentDate: string;
  incidentDetails: string;
  lossDamageDetails: string;
}

export interface Claim {
  id: string;
  productId: string;
  startDate: string;
  endDate: string;
  details: string;
  status: string;
}

export const initialFormData: ClaimFormData = {
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  policyId: '',
  policyType: '',
  address: '',
  incidentDate: '',
  incidentDetails: '',
  lossDamageDetails: ''
};

const CLAIMS_STORAGE_KEY = 'insurance_claims';

export const generateClaimId = (): string => 
  `ID_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

export const saveClaim = (claimData: Omit<Claim, 'id'>): Claim => {
  const newClaimId = generateClaimId();
  const newClaim: Claim = {
    id: newClaimId,
    ...claimData
  };

  const existingClaimsJSON = localStorage.getItem(CLAIMS_STORAGE_KEY);
  const existingClaims: Claim[] = existingClaimsJSON ? JSON.parse(existingClaimsJSON) : [];
  const updatedClaims = [newClaim, ...existingClaims];
  
  localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(updatedClaims));
  
  return newClaim;
};
