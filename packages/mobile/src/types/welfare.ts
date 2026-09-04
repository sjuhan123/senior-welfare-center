import type { DistrictData } from './district';

export type WelfareData = {
  _id: string;
  district: DistrictData;
  name: string;
  address: string;
  phone: string;
  homepage: string;
  distance: number;
  remarks?: string;
  images: string[];
};

export type WelfareResponse = {
  statusCode: number;
  message: string;
  data: WelfareData[];
};
