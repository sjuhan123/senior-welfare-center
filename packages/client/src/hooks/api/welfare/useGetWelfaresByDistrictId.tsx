import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import { get } from '../../../libs/api';
import { WelfareData } from '../../../types/welfare';
import { END_POINT } from '../../../constant/endpoint';
import { API_DELAY_TIME } from '../constant';

type Response = {
  status: number;
  message: string;
  data: WelfareData[];
};

const getWelfaresByDistrictIdQueryKey = (districtId: string | null) => [
  QUERY_KEYS.WELFARES,
  districtId,
];

const getWelfaresByDistrictId = (
  districtId: string | null,
): Promise<Response> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(get<Response>(`${END_POINT.WELFARES}?districtId=${districtId}`));
    }, API_DELAY_TIME);
  });
};

const useGetWelfaresByDistrictId = (
  districtId: string | null,
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
