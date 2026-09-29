import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const EXTENSION_BY_CONTENT_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
};

const PRESIGN_EXPIRES_IN_SECONDS = 5 * 60;

/** 메시지 사진 첨부용 presigned PUT URL 발급. 46. 메시지 사진 첨부 참고. */
async function createPhotoPresignedUpload(roomId, contentType) {
  const extension = EXTENSION_BY_CONTENT_TYPE[contentType];
  if (!extension) return null;

  const key = `messages/${roomId}/${randomUUID()}.${extension}`;
  const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: PRESIGN_EXPIRES_IN_SECONDS });
  const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl };
}

export { createPhotoPresignedUpload };
