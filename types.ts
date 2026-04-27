export interface Member {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  photo: string;
  joinDate: string;
  membershipPlan: string;
  membershipStart: string;
  membershipEnd: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  status: 'active' | 'soon' | 'expired' | 'inactive';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: string;
  method: string;
  note: string;
}

export interface MembershipPlan {
  name: string;
  months: number;
  price: number;
}

export interface Settings {
  gymName: string;
  gymLogo: string;
  currency: string;
  defaultPlans: MembershipPlan[];
}
