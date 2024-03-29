import { WelfareData } from './welfare';

export type UserKakaoInfo = {
  userName: string;
  userAvatar: string;
};

export type User = UserKakaoInfo & {
  qualificationChecked: boolean;
  bookmarkWelfares: WelfareData[];
};

export type UserResponse = {
  statusCode: number;
  message: string;
  data: User;
};
