export type WelfareData = {
  id: number;
  district: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
};

export type WelfareResponse = {
  statusCode: number;
  message: string;
  data: WelfareData[];
};
