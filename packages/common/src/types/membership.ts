import type { WelfareData } from './welfare';

export type MembershipRole = 'member' | 'teacher' | 'admin' | 'super';
export type MembershipStatus = 'pending' | 'approved';

export type MembershipData = {
  _id: string;
  userId: string;
  welfare: WelfareData;
  role: MembershipRole;
  status: MembershipStatus;
  active: boolean;
  joinedVia: 'qr' | 'manual';
  createdAt: string;
};

export type MembershipListResponse = {
  statusCode: number;
  message: string;
  data: MembershipData[];
};

export type MembershipScanResponse = {
  statusCode: number;
  message: string;
  data: { membership: MembershipData; welfare: WelfareData };
};

export type MemberFilter = 'all' | 'staff' | 'teacher' | 'member' | 'off';

export type WelfareMemberData = {
  _id: string;
  userId: string;
  userName: string;
  role: MembershipRole;
  status: MembershipStatus;
  active: boolean;
  joinedVia: 'qr' | 'manual';
  createdAt: string;
};

export type WelfareMemberListResponse = {
  statusCode: number;
  message: string;
  data: { members: WelfareMemberData[]; total: number };
};
