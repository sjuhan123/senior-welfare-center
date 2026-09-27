import { useQuery } from '@tanstack/react-query';
import type { NoticeCountResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getNoticeCount = (welfareId: string, since: string) =>
  get<NoticeCountResponse>(`${END_POINT.WELFARES}/${welfareId}/notices/count`, { params: { since } });

const useGetNoticeCount = (welfareId: string, since: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTICES, 'count', welfareId, since],
    queryFn: () => getNoticeCount(welfareId, since),
  });
};

export default useGetNoticeCount;
