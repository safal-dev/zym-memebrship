import { Member, Payment, Settings } from '@/types';

export const INITIAL_MEMBERS: Member[] = [
  {
    "id": "MB001",
    "fullName": "safal poudel",
    "phone": "9748435017",
    "address": "kawasoti nawalparaasi",
    "photo": "",
    "joinDate": "2026-04-26",
    "membershipPlan": "Monthly",
    "membershipStart": "2026-04-26",
    "membershipEnd": "2026-05-26",
    "totalFee": 3000,
    "paidAmount": 2000,
    "dueAmount": 1000,
    "status": "active",
    "notes": "",
    "createdAt": "2026-04-26T16:04:38.233Z",
    "updatedAt": "2026-04-26T16:05:06.431Z"
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    "id": "PAY001",
    "memberId": "MB001",
    "memberName": "safal poudel",
    "amount": 2000,
    "paymentDate": "2026-04-26",
    "method": "cash",
    "note": "Initial payment"
  }
];

export const INITIAL_SETTINGS: Settings = {
  gymName: 'FitZone Gym',
  gymLogo: '',
  currency: 'NPR',
  defaultPlans: [
    { name: 'Monthly', months: 1, price: 3000 },
    { name: '3 Months', months: 3, price: 8000 },
    { name: '6 Months', months: 6, price: 15000 },
    { name: 'Yearly', months: 12, price: 28000 },
  ],
};
