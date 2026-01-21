
import { LandRecord, LandStatus, UserProfile } from './types';

export const MOCK_USER: UserProfile = {
  id: 'u-1',
  name: 'John Doe',
  email: 'john.doe@ardhichain.ke',
  role: 'BUYER',
  verified: true,
  walletBalance: 2500000,
  walletAddress: '0xABC...1234',
  transactions: [
    {
      id: 'tx-init-1',
      timestamp: '2023-12-01',
      from: 'CENTRAL_BANK',
      to: 'John Doe',
      type: 'VERIFICATION',
      hash: '0x772b...f91a',
      landLrNumber: 'ACCOUNT_FUNDING'
    },
    {
      id: 'tx-init-2',
      timestamp: '2024-01-10',
      from: 'SYSTEM',
      to: 'John Doe',
      type: 'VERIFICATION',
      hash: '0x991c...e22b',
      landLrNumber: 'ID_VERIFICATION'
    }
  ]
};

export const INITIAL_LAND_DATA: LandRecord[] = [
  {
    id: 'l-1',
    lrNumber: 'SIAYA/ALEGO/4502',
    location: 'Nyar Alego',
    county: 'Siaya',
    size: '1.0 Acre',
    price: 850000,
    owner: {
      id: 's-1',
      name: 'Nyar Alego',
      identityVerified: true,
      walletAddress: '0x71C...3e4f',
    },
    status: LandStatus.AVAILABLE,
    description: 'Prime agricultural land with proximity to the main road. Fertile soil suitable for maize and beans.',
    imageUrl: 'https://picsum.photos/seed/siaya/800/600',
    deedSignature: 'SH256-ALEGO-8829-AF91',
    history: [
      { id: 't-1', timestamp: '2023-01-15', from: 'SYSTEM', to: 'Nyar Alego', type: 'REGISTRATION', hash: '0xabc123...' }
    ]
  },
  {
    id: 'l-2',
    lrNumber: 'NAIROBI/KILIMANI/102',
    location: 'Kilimani',
    county: 'Nairobi',
    size: '0.25 Acre',
    price: 45000000,
    owner: {
      id: 's-2',
      name: 'Central Developers Ltd',
      identityVerified: true,
      walletAddress: '0x92D...9a1b',
    },
    status: LandStatus.DISPUTED,
    description: 'Commercial plot in the heart of Kilimani. High ROI potential.',
    courtCaseReference: 'ELC/B22/2022',
    imageUrl: 'https://picsum.photos/seed/nairobi/800/600',
    deedSignature: 'SH256-KILI-0012-BB21',
    history: [
      { id: 't-2', timestamp: '2022-05-10', from: 'SYSTEM', to: 'Central Developers Ltd', type: 'REGISTRATION', hash: '0xdef456...' },
      { id: 't-3', timestamp: '2024-02-01', from: 'SYSTEM', to: 'SYSTEM', type: 'DISPUTE_FLAG', hash: '0xghi789...' }
    ]
  },
  {
    id: 'l-3',
    lrNumber: 'NAKURU/MAU-NAROK/88',
    location: 'Mau Narok',
    county: 'Nakuru',
    size: '10.0 Acres',
    price: 12000000,
    owner: {
      id: 's-3',
      name: 'Samuel Kiprop',
      identityVerified: true,
      walletAddress: '0x12A...5f6c',
    },
    status: LandStatus.AVAILABLE,
    description: 'Large scale farming land. Previously used for wheat cultivation.',
    imageUrl: 'https://picsum.photos/seed/nakuru/800/600',
    deedSignature: 'SH256-MAU-5541-CC11',
    history: [
      { id: 't-4', timestamp: '2021-11-20', from: 'SYSTEM', to: 'Samuel Kiprop', type: 'REGISTRATION', hash: '0xjkl012...' }
    ]
  }
];
