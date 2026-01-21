
export enum LandStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING_SALE = 'PENDING_SALE',
  DISPUTED = 'DISPUTED',
  SOLD = 'SOLD',
  VERIFYING = 'VERIFYING'
}

export interface LandOwner {
  id: string;
  name: string;
  identityVerified: boolean;
  walletAddress: string;
}

export interface LandRecord {
  id: string;
  lrNumber: string; // Land Reference Number
  location: string;
  county: string;
  size: string;
  price: number;
  owner: LandOwner;
  status: LandStatus;
  description: string;
  courtCaseReference?: string;
  imageUrl: string;
  deedSignature: string; // Blockchain-style signature
  history: TransactionRecord[];
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  type: 'TRANSFER' | 'REGISTRATION' | 'DISPUTE_FLAG' | 'VERIFICATION';
  hash: string;
  landLrNumber?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  verified: boolean;
  walletBalance: number;
  walletAddress: string;
  transactions: TransactionRecord[];
}
