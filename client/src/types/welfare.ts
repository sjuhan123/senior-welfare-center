export type WelfareData = {
  _id: number;
  district: {
    _id: number;
    name: string;
  };
  name: string;
  address: string;
  phone: string;
  remarks?: string;
};

export type WelfareResponse = {
  statusCode: number;
  message: string;
  data: WelfareData[];
};
