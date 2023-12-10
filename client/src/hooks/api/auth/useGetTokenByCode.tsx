import { END_POINT } from "../../../constant/endpoint";
import { get } from "../../../libs/api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { UseQueryOptions, useQuery } from "react-query";

type Response = {
  status: number;
  message: string;
  data: string;
};

export const getTokenByCodeQueryKey = (code: string) => [
  QUERY_KEYS.TOKEN,
  code,
];

export const getTokenByCode = (code: string) =>
  get<Response>(`${END_POINT.KAKAO_LOGIN}?code=${code}`);

const useGetTokenByCode = (
  code: string,
  options?: UseQueryOptions<Response>
) => {
  return useQuery<Response>({
    queryKey: getTokenByCodeQueryKey(code),
    queryFn: () => getTokenByCode(code),
    ...options,
  });
};

export default useGetTokenByCode;
