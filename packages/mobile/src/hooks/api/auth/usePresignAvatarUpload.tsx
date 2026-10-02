import type { PhotoPresignResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';

export const presignAvatarUpload = (contentType: string) => post<PhotoPresignResponse>(`${END_POINT.USER}/avatar/presign-upload`, { contentType });
