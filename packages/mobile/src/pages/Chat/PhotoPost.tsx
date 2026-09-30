import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import { messageDateLabel, formatMessageTime } from './chatDisplay';
import PhotoCarousel from './PhotoCarousel';

type Props = {
  message: MessageData;
  showDateDivider: boolean;
  canManage: boolean;
  onHide: (messageId: string) => void;
  onToggleHeart: (messageId: string) => void;
  onPressComments: () => void;
  myUserId: string;
  /** 사진이 아직 S3 업로드 중인지(낙관적 전송 중 로컬 미리보기 위에 스피너 표시) */
  isUploadingPhotos?: boolean;
  /** 사진 업로드가 실패했는지(스피너 대신 X 표시) */
  hasUploadFailed?: boolean;
};

const PhotoPost = ({
  message,
  showDateDivider,
  canManage,
  onHide,
  onToggleHeart,
  onPressComments,
  myUserId,
  isUploadingPhotos = false,
  hasUploadFailed = false,
}: Props) => {
  const styles = useStyles(photoPostStyleFactory);
  const hasHearted = message.hearts.includes(myUserId);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  /** 캐러셀에서 지금 보고 있는 사진 한 장만 로컬로 내려받아 OS 공유 시트로 내보냄 */
  const handleShare = async () => {
    const photoUrl = message.photos[currentPhotoIndex];
    if (!photoUrl) return;

    try {
      const downloaded = await File.downloadFileAsync(photoUrl, new Directory(Paths.cache), { idempotent: true });
      await Sharing.shareAsync(downloaded.uri);
    } catch (error) {
      console.error('사진 공유 실패:', error);
      Alert.alert('안내', '사진을 공유하지 못했습니다');
    }
  };

  return (
    <View>
      {showDateDivider && (
        <View style={styles.dateDividerWrap}>
          <Text style={styles.dateDivider}>{messageDateLabel(message.createdAt)}</Text>
        </View>
      )}
      <View style={styles.postRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{message.senderName.charAt(0)}</Text>
        </View>
        <View style={styles.postMain}>
          <Text style={styles.senderName}>{message.senderName}</Text>
          <View style={styles.card}>
            <View style={styles.cardInner}>
              {message.hidden ? (
                <Text style={styles.hiddenText}>가려진 사진입니다</Text>
              ) : (
                <>
                  <PhotoCarousel
                    photos={message.photos}
                    isUploadingPhotos={isUploadingPhotos}
                    hasUploadFailed={hasUploadFailed}
                    onIndexChange={setCurrentPhotoIndex}
                  />
                  {!!message.text && <Text style={styles.caption}>{message.text}</Text>}
                  {canManage && (
                    <View style={styles.manageRow}>
                      <Pressable style={styles.hideButton} onPress={() => onHide(message._id)}>
                        <Text style={styles.hideButtonText}>가리기</Text>
                      </Pressable>
                    </View>
                  )}
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.heartButton, hasHearted && styles.heartButtonActive]} onPress={() => onToggleHeart(message._id)}>
                      <Text style={[styles.heartButtonText, hasHearted && styles.heartButtonTextActive]}>좋아요 {message.hearts.length}</Text>
                    </Pressable>
                    <Pressable style={styles.commentButton} onPress={onPressComments}>
                      <Text style={styles.commentButtonText}>댓글 {message.commentCount}</Text>
                    </Pressable>
                    <Pressable style={styles.shareButton} onPress={() => void handleShare()}>
                      <Text style={styles.shareButtonText}>보내기</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
          <Text style={styles.time}>{formatMessageTime(message.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
};

export default PhotoPost;

const photoPostStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    dateDividerWrap: {
      alignItems: 'center',
      marginBottom: 16,
    },
    dateDivider: {
      paddingHorizontal: 15,
      paddingVertical: 7,
      borderRadius: radius.label,
      backgroundColor: color.grey150,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey700,
    },
    postRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    avatar: {
      flexShrink: 0,
      width: 52,
      height: 52,
      borderRadius: 15,
      backgroundColor: color.grey150,
      borderWidth: 1,
      borderColor: color.grey300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    postMain: {
      flex: 1,
      minWidth: 0,
    },
    senderName: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey600,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    card: {
      borderRadius: 14,
      shadowColor: color.grey900,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
    },
    cardInner: {
      backgroundColor: semantic.bgSurface,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: 14,
      borderTopLeftRadius: 5,
      overflow: 'hidden',
    },
    hiddenText: {
      padding: 15,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      color: semantic.textPrimary,
    },
    caption: {
      padding: 16,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.6,
      color: semantic.textPrimary,
    },
    manageRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: semantic.divider,
    },
    hideButton: {
      minHeight: hit.mobileCompact,
      paddingHorizontal: 14,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.label,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hideButtonText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    actionRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: semantic.divider,
    },
    heartButton: {
      flex: 1,
      minHeight: hit.mobileLarge,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heartButtonActive: {
      backgroundColor: color.navySoft,
    },
    heartButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    heartButtonTextActive: {
      color: color.navyDeep,
    },
    commentButton: {
      flex: 1,
      minHeight: hit.mobileLarge,
      alignItems: 'center',
      justifyContent: 'center',
      borderLeftWidth: 1,
      borderLeftColor: semantic.divider,
    },
    commentButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    shareButton: {
      minWidth: 92,
      minHeight: hit.mobileLarge,
      alignItems: 'center',
      justifyContent: 'center',
      borderLeftWidth: 1,
      borderLeftColor: semantic.divider,
    },
    shareButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    time: {
      marginTop: 6,
      paddingHorizontal: 4,
      fontSize: fontSize('caption'),
      color: color.grey500,
    },
  });
