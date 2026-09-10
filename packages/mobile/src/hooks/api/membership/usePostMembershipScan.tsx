import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import type { MembershipScanResponse } from '@common/shared';

export const postMembershipScan = (code: string) => post<MembershipScanResponse>(END_POINT.MEMBERSHIP_SCAN, { code });
