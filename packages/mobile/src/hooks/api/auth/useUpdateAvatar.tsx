import type { UpdateAvatarResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';

export const updateAvatar = (customAvatar: string) => patch<UpdateAvatarResponse>(`${END_POINT.USER}/avatar`, { customAvatar });
