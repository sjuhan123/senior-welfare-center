import { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import { messageDateLabel, formatMessageTime } from './chatDisplay';
import ChatAvatar from './ChatAvatar';

type Props = {
  message: MessageData;
  showDateDivider: boolean;
  hiddenLabel: string;
  canManage: boolean;
  onHide: (messageId: string) => void;
  /** 내가 보낸 메시지는 아바타·이름 없이 오른쪽 정렬(이야기방 전용). 공지방은 항상 false */
  isMine?: boolean;
  /** 메시지 메타 정보에서 시각을 가리기 버튼보다 먼저 보여줄지(공지방 전용) */
  timeFirst?: boolean;
  /** 사진이 아직 S3 업로드 중인지(이야기방 전용, 낙관적 전송 중 로컬 미리보기 위에 스피너 표시) */
  isUploadingPhotos?: boolean;
  /** 사진 업로드가 실패했는지(이야기방 전용, 스피너 대신 X 표시) */
  hasUploadFailed?: boolean;
  /** 보낸 사람이 직접 설정한 프로필 사진(없으면 이니셜 표시) */
  avatarUrl?: string;
};

const MessageBubble = ({
  message,
  showDateDivider,
  hiddenLabel,
  canManage,
  onHide,
  isMine = false,
  timeFirst = false,
  isUploadingPhotos = false,
  hasUploadFailed = false,
  avatarUrl,
}: Props) => {
  const styles = useStyles(messageBubbleStyleFactory);
  const [viewerPhotoUrl, setViewerPhotoUrl] = useState<string | null>(null);

  const hideButton = canManage && !message.hidden && (
    <Pressable style={styles.hideButton} onPress={() => onHide(message._id)}>
      <Text style={styles.hideButtonText}>가리기</Text>
    </Pressable>
  );
  const timeText = <Text style={styles.messageTime}>{formatMessageTime(message.createdAt)}</Text>;

  return (
    <View>
      {showDateDivider && (
        <View style={styles.dateDividerWrap}>
          <Text style={styles.dateDivider}>{messageDateLabel(message.createdAt)}</Text>
        </View>
      )}
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        {!isMine && <ChatAvatar size={52} borderRadius={15} initial={message.senderName.charAt(0)} photoUrl={avatarUrl} />}
        <View style={[styles.messageMain, isMine && styles.messageMainMine]}>
          {!isMine && <Text style={styles.senderName}>{message.senderName}</Text>}
          <View style={[styles.bubble, isMine && styles.bubbleMine]}>
            {message.hidden ? (
              <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{hiddenLabel}</Text>
            ) : (
              <>
                {message.photos.length > 0 && (
                  <View style={[styles.photoGrid, !!message.text && styles.photoGridWithText]}>
                    {message.photos.map(photoUrl => (
                      <Pressable key={photoUrl} style={styles.photoThumbnailWrap} onPress={() => setViewerPhotoUrl(photoUrl)}>
                        <Image source={{ uri: photoUrl }} style={styles.photoThumbnail} />
                        {(isUploadingPhotos || hasUploadFailed) && (
                          <View style={styles.photoUploadingOverlay}>
                            {hasUploadFailed ? <Text style={styles.photoFailedText}>×</Text> : <ActivityIndicator color={color.grey0} />}
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
                {!!message.text && (
                  <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]} lineBreakStrategyIOS="hangul-word">
                    {message.text}
                  </Text>
                )}
              </>
            )}
          </View>
          <View style={[styles.messageMeta, isMine && styles.messageMetaMine]}>
            {timeFirst ? (
              <>
                {timeText}
                {hideButton}
              </>
            ) : (
              <>
                {hideButton}
                {timeText}
              </>
            )}
          </View>
        </View>
      </View>

      <Modal visible={!!viewerPhotoUrl} transparent animationType="fade" onRequestClose={() => setViewerPhotoUrl(null)}>
        <Pressable style={styles.viewerBackdrop} onPress={() => setViewerPhotoUrl(null)}>
          {!!viewerPhotoUrl && <Image source={{ uri: viewerPhotoUrl }} style={styles.viewerImage} resizeMode="contain" />}
        </Pressable>
      </Modal>
    </View>
  );
};

export default MessageBubble;

const messageBubbleStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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
    messageRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    messageRowMine: {
      justifyContent: 'flex-end',
    },
    messageMain: {
      flex: 1,
      minWidth: 0,
    },
    messageMainMine: {
      flex: 0,
      maxWidth: '78%',
      alignItems: 'flex-end',
    },
    senderName: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey600,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    bubble: {
      alignSelf: 'flex-start',
      maxWidth: '100%',
      backgroundColor: semantic.bgSurface,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: 14,
      borderTopLeftRadius: 5,
      paddingHorizontal: 18,
      paddingVertical: 15,
    },
    bubbleMine: {
      backgroundColor: color.navy,
      borderColor: color.navy,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 5,
    },
    bubbleText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.6,
      color: semantic.textPrimary,
    },
    bubbleTextMine: {
      color: semantic.textOnDark,
    },
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    photoGridWithText: {
      marginBottom: 10,
    },
    photoThumbnailWrap: {
      width: 120,
      height: 120,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: color.grey150,
    },
    photoThumbnail: {
      width: '100%',
      height: '100%',
    },
    photoUploadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoFailedText: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    viewerBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewerImage: {
      width: '100%',
      height: '100%',
    },
    messageMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
      paddingHorizontal: 4,
    },
    messageMetaMine: {
      flexDirection: 'row-reverse',
    },
    messageTime: {
      fontSize: fontSize('caption'),
      color: color.grey500,
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
  });
