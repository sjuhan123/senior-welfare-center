export type NoticeEntry = {
  _id: string;
  room: string;
  roomLabel: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type NoticeListResponse = {
  statusCode: number;
  message: string;
  data: NoticeEntry[];
};

export type NoticeCountResponse = {
  statusCode: number;
  message: string;
  data: { count: number };
};

export type MessageData = {
  _id: string;
  room: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  photos: string[];
  editable: boolean;
  hidden: boolean;
  hearts: string[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MessageResponse = {
  statusCode: number;
  message: string;
  data: MessageData;
};

export type MessageListResponse = {
  statusCode: number;
  message: string;
  data: {
    messages: MessageData[];
    canSend: boolean;
    canManage: boolean;
  };
};

export type PhotoPresignResponse = {
  statusCode: number;
  message: string;
  data: { uploadUrl: string; publicUrl: string };
};

export type CommentData = {
  _id: string;
  message: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentListResponse = {
  statusCode: number;
  message: string;
  data: CommentData[];
};
