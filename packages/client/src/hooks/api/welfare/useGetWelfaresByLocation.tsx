import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import { get } from '../../../libs/api';
import { WelfareData } from '../../../types/welfare';
import { END_POINT } from '../../../constant/endpoint';
import type { Location } from '../../../types/location';
import { API_DELAY_TIME } from '../constant';

type Response = {
  status: number;
  message: string;
  data: WelfareData[];
};

const getWelfaresLocation = (location: Location | null): Promise<Response> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        get<Response>(
          `${END_POINT.CLOSEST_WELFARES}?latitude=${location?.latitude}&longitude=${location?.longitude}`,
        ),
      );
    }, API_DELAY_TIME);
  });
};

const useGetWelfaresLocation = (
  location: Location | null,
  options?: UseQueryOptions<Response>,
) => {
  return useQuery<Response>({
    queryKey: [QUERY_KEYS.CLOSEST_WELFARES, location],
    queryFn: () => getWelfaresLocation(location),
    enabled: !!location,
    ...options,
  });
};

export default useGetWelfaresLocation;
