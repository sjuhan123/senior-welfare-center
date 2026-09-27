export type RoomType = 'notice' | 'chat' | 'feed';

export type RoomData = {
  _id: string;
  welfare: string;
  course: string | null;
  type: RoomType;
  availableFrom: string | null;
  availableTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoomListItem = {
  room: RoomData;
  latestMessage: unknown | null;
  unreadCount: number;
};

export type RoomListResponse = {
  statusCode: number;
  message: string;
  data: RoomListItem[];
};
