import { WelfareData } from "./welfare";

export type User = {
  userName: string;
  userAvatar: string;
  qualificationChecked: boolean;
  bookmarkWelfares: WelfareData[];
};

export type UserResponse = {
  statusCode: number;
  message: string;
  data: User;
};
