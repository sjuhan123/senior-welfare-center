import { useQuery } from '@tanstack/react-query';
import type { CommentListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getComments = (welfareId: string, roomId: string, messageId: string) =>
  get<CommentListResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/messages/${messageId}/comments`);

const useGetComments = (welfareId: string, roomId: string, messageId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, welfareId, roomId, messageId],
    queryFn: () => getComments(welfareId, roomId, messageId),
  });
};

export default useGetComments;
