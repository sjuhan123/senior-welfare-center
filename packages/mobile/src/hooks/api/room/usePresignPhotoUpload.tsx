import type { PhotoPresignResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';

export const presignPhotoUpload = (welfareId: string, roomId: string, contentType: string) =>
  post<PhotoPresignResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/photos/presign-upload`, { contentType });
