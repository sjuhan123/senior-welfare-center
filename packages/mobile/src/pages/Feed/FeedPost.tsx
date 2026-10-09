import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { color, semantic, radius, hit } from '@common/shared';
import type { FeedPostEntry } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import { formatMessageTime } from '../../features/chat/chatDisplay';
import PhotoCarousel from '../../features/chat/PhotoCarousel';
import ChatAvatar from '../../features/chat/ChatAvatar';

type Props = {
  post: FeedPostEntry;
  roomName: string;
  myUserId: string;
  onHide: (messageId: string) => void;
  onToggleHeart: (messageId: string) => void;
  onPressComments: (messageId: string, roomId: string) => void;
  /** 보낸 사람이 직접 설정한 프로필 사진(없으면 이니셜 표시) */
  avatarUrl?: string;
};

/** 사진방 탭(여러 방 모아보기) 전용 게시물 카드. 개별 방 화면의 PhotoPost와 달리 모서리가 균일하고, 카드 위에 방 이름을 보여줌(프로토타입 "14 사진방 탭" 기준). */
const FeedPost = ({ post, roomName, myUserId, onHide, onToggleHeart, onPressComments, avatarUrl }: Props) => {
  const styles = useStyles(feedPostStyleFactory);
  const hasHearted = post.hearts.includes(myUserId);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleShare = async () => {
    const photoUrl = post.photos[currentPhotoIndex];
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
    <View style={styles.card}>
      <Text style={styles.roomName}>{roomName}</Text>
      <View style={styles.headerRow}>
        <ChatAvatar size={54} borderRadius={16} initial={post.senderName.charAt(0)} photoUrl={avatarUrl} />
        <View style={styles.headerInfo}>
          <Text style={styles.senderName}>{post.senderName}</Text>
          <Text style={styles.time}>{formatMessageTime(post.createdAt)}</Text>
        </View>
      </View>

      {post.hidden ? (
        <Text style={styles.hiddenText}>가려진 사진입니다</Text>
      ) : (
        <>
          <PhotoCarousel photos={post.photos} height={230} onIndexChange={setCurrentPhotoIndex} />
          {!!post.text && <Text style={styles.caption}>{post.text}</Text>}
          {post.canManage && (
            <View style={styles.manageRow}>
              <Pressable style={styles.hideButton} onPress={() => onHide(post._id)}>
                <Text style={styles.hideButtonText}>가리기</Text>
              </Pressable>
            </View>
          )}
          <View style={styles.actionRow}>
            <Pressable style={[styles.heartButton, hasHearted && styles.heartButtonActive]} onPress={() => onToggleHeart(post._id)}>
              <Text style={[styles.actionButtonText, hasHearted && styles.heartButtonTextActive]}>좋아요 {post.hearts.length}</Text>
            </Pressable>
            <Pressable style={styles.commentButton} onPress={() => onPressComments(post._id, post.room)}>
              <Text style={styles.actionButtonText}>댓글 {post.commentCount}</Text>
            </Pressable>
            <Pressable style={styles.shareButton} onPress={() => void handleShare()}>
              <Text style={styles.actionButtonText}>보내기</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default FeedPost;

const feedPostStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    card: {
      backgroundColor: semantic.bgSurface,
      borderWidth: 1,
      borderColor: color.grey300,
      borderRadius: 12,
      overflow: 'hidden',
    },
    roomName: {
      paddingHorizontal: 18,
      paddingTop: 14,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      paddingHorizontal: 18,
    },
    headerInfo: {
      flex: 1,
      minWidth: 0,
    },
    senderName: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    time: {
      marginTop: 2,
      fontSize: fontSize('sm'),
      color: color.grey500,
    },
    hiddenText: {
      padding: 18,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      color: semantic.textPrimary,
    },
    caption: {
      padding: 18,
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
    actionButtonText: {
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
    shareButton: {
      flexShrink: 0,
      minWidth: 86,
      minHeight: hit.mobileLarge,
      alignItems: 'center',
      justifyContent: 'center',
      borderLeftWidth: 1,
      borderLeftColor: semantic.divider,
    },
  });
