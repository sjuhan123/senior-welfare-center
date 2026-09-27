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
  createdAt: string;
  updatedAt: string;
};

export type MessageResponse = {
  statusCode: number;
  message: string;
  data: MessageData;
};
