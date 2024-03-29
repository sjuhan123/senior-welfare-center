import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import { get } from '../../../libs/api';
import { END_POINT } from '../../../constant/endpoint';
import { DistrictData } from '../../../types/district';

type Response = {
  status: number;
  message: string;
  data: DistrictData[];
};

const useGetDistricts = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>({
    queryKey: QUERY_KEYS.DISTRICTS,
    queryFn: () => get<Response>(END_POINT.DISTRICTS),
    ...options,
  });
};

export default useGetDistricts;
