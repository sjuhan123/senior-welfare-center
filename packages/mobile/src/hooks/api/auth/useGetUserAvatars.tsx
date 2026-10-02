import { useQuery } from '@tanstack/react-query';
import type { UserAvatarsResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getUserAvatars = (ids: string[]) => post<UserAvatarsResponse>(`${END_POINT.USER}/avatars`, { ids });

/** 메시지·댓글·게시물 목록에 보이는 보낸 사람들의 아바타를 한 번에 조회해서 userId -> customAvatar 맵으로 돌려줌 */
const useGetUserAvatars = (userIds: string[]) => {
  const sortedIds = [...new Set(userIds)].sort();

  return useQuery({
    queryKey: [QUERY_KEYS.USER_AVATARS, sortedIds],
    queryFn: () => getUserAvatars(sortedIds),
    enabled: sortedIds.length > 0,
    select: response => new Map(response.data.map(entry => [entry.id, entry.customAvatar])),
  });
};

export default useGetUserAvatars;
