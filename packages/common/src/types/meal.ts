export type MealData = {
  _id: string;
  welfare: string;
  date: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
};

export type MealListResponse = {
  statusCode: number;
  message: string;
  data: MealData[];
};

export type MealDetailResponse = {
  statusCode: number;
  message: string;
  data: MealData;
};
