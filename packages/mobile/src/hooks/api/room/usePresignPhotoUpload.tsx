import type { PhotoPresignResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';

export const presignPhotoUpload = (welfareId: string, roomId: string, contentType: string) =>
  post<PhotoPresignResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/photos/presign-upload`, { contentType });

/** 사진 하나를 presigned URL로 S3에 업로드하고 공개 URL을 반환. 46. 메시지 사진 첨부 참고. */
export const uploadPhotoToRoom = async (welfareId: string, roomId: string, photo: { uri: string; contentType: string }): Promise<string> => {
  const presignRes = await presignPhotoUpload(welfareId, roomId, photo.contentType);
  const { uploadUrl, publicUrl } = presignRes.data;
  const fileBlob = await (await fetch(photo.uri)).blob();
  const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': photo.contentType }, body: fileBlob });

  if (!uploadRes.ok) {
    const body = await uploadRes.text();
    throw new Error(`S3 업로드 실패 (${uploadRes.status}): ${body}`);
  }

  return publicUrl;
};
