import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { MembershipScanResponse } from '../../../types/membership';

export const postMembershipScan = (code: string) => post<MembershipScanResponse>(END_POINT.MEMBERSHIP_SCAN, { code });
