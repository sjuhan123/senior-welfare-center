export type LostItemData = {
  _id: string;
  welfare: string;
  item: string;
  where: string;
  when: string;
  keep: string;
  claimed: boolean;
  notifyNotice: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LostItemListResponse = {
  statusCode: number;
  message: string;
  data: LostItemData[];
};

export type LostItemDetailResponse = {
  statusCode: number;
  message: string;
  data: LostItemData;
};
