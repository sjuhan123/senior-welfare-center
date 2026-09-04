import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import { get } from '../../../libs/api';
import { END_POINT } from '../../../constant/endpoint';
import { DistrictData } from '../../../types/district';
import { API_DELAY_TIME } from '../constant';

type Response = {
  status: number;
  message: string;
  data: DistrictData[];
};

const getDistricts = (): Promise<Response> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(get<Response>(END_POINT.DISTRICTS));
    }, API_DELAY_TIME);
  });
};

const useGetDistricts = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>({
    queryKey: QUERY_KEYS.DISTRICTS,
    queryFn: getDistricts,
    ...options,
  });
};

export default useGetDistricts;
