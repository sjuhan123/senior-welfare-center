export type User = {
  userName: string;
  userAvatar: string;
  qualificationChecked: boolean;
  bookmarkWelfares: string[];
};

export type UserResponse = {
  statusCode: number;
  message: string;
  data: User;
};
