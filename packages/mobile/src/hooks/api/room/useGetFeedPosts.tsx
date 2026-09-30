import { useQuery } from '@tanstack/react-query';
import type { FeedPostListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getFeedPosts = (welfareId: string, roomId: string | null) =>
  get<FeedPostListResponse>(`${END_POINT.WELFARES}/${welfareId}/feed-posts${roomId ? `?roomId=${roomId}` : ''}`);

const useGetFeedPosts = (welfareId: string, roomId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEED_POSTS, welfareId, roomId],
    queryFn: () => getFeedPosts(welfareId, roomId),
  });
};

export default useGetFeedPosts;
