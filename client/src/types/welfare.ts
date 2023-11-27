export type WelfareData = {
  _id: string;
  district: {
    _id: string;
    name: string;
  };
  name: string;
  address: string;
  phone: string;
  homepage: string;
  remarks?: string;
};

export type WelfareResponse = {
  statusCode: number;
  message: string;
  data: WelfareData[];
};
