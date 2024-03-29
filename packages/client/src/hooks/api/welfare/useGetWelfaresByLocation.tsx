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

const getWelfaresLocation = (latitude: number, longitude: number) =>
  get<Response>(
    `${END_POINT.CLOSEST_WELFARES}?latitude=${latitude}&longitude=${longitude}`,
  );

const useGetWelfaresLocation = (
  location: {
    latitude: number;
    longitude: number;
  },
  options?: UseQueryOptions<Response>,
) => {
  return useQuery<Response>({
    queryKey: [QUERY_KEYS.CLOSEST_WELFARES, location],
    queryFn: () => getWelfaresLocation(location.latitude, location.longitude),
    enabled: !!location,
    ...options,
  });
};

export default useGetWelfaresLocation;
