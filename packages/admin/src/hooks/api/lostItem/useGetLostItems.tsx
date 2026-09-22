import { useQuery } from '@tanstack/react-query';
import type { LostItemListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getLostItems = (welfareId: string) => get<LostItemListResponse>(`${END_POINT.WELFARES}/${welfareId}/lost-items`);

const useGetLostItems = (welfareId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOST_ITEMS, welfareId],
    queryFn: () => getLostItems(welfareId),
  });
};

export default useGetLostItems;
