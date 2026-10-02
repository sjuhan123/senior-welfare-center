import type { WelfareData } from './welfare';

export type User = {
  userName: string;
  userAvatar: string;
  customAvatar: string;
  qualificationChecked: boolean;
  bookmarkWelfares: WelfareData[];
};

export type UserResponse = {
  statusCode: number;
  message: string;
  data: User;
};

export type UpdateAvatarResponse = {
  statusCode: number;
  message: string;
  data: { customAvatar: string };
};

export type UserAvatarEntry = {
  id: string;
  customAvatar: string;
};

export type UserAvatarsResponse = {
  statusCode: number;
  message: string;
  data: UserAvatarEntry[];
};
