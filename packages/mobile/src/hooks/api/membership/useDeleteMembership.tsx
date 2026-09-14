import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';

type Response = {
  statusCode: number;
  message: string;
};

export const deleteMembership = (membershipId: string) => del<Response>(`${END_POINT.MEMBERSHIPS}/${membershipId}`);
