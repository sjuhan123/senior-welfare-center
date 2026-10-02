import { useInfiniteQuery } from '@tanstack/react-query';
import type { NoticeListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

const PAGE_SIZE = 20;

export const getNotices = (welfareId: string, before?: string) =>
  get<NoticeListResponse>(`${END_POINT.WELFARES}/${welfareId}/notices`, { params: { before, limit: PAGE_SIZE } });

const useGetNotices = (welfareId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.NOTICES, welfareId],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => getNotices(welfareId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => {
      if (lastPage.data.length < PAGE_SIZE) return undefined;
      return lastPage.data[lastPage.data.length - 1].createdAt;
    },
  });
};

export default useGetNotices;
