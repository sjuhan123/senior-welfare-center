import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import { get } from '../../../libs/api';
import { WelfareData } from '../../../types/welfare';
import { END_POINT } from '../../../constant/endpoint';

type Response = {
  status: number;
  message: string;
  data: WelfareData[];
};

const getWelfaresByDistrictIdQueryKey = (districtId: string) => [
  QUERY_KEYS.WELFARES,
  districtId,
];

const getWelfaresByDistrictId = (districtId: string) =>
  get<Response>(`${END_POINT.WELFARES}?districtId=${districtId}`);

const useGetWelfaresByDistrictId = (
  districtId: string,
  options?: UseQueryOptions<Response>,
) => {
  return useQuery<Response>({
    queryKey: getWelfaresByDistrictIdQueryKey(districtId),
    queryFn: () => getWelfaresByDistrictId(districtId),
    enabled: !!districtId,
    ...options,
  });
};

export default useGetWelfaresByDistrictId;
