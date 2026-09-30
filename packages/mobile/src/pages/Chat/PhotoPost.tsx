import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import { messageDateLabel, formatMessageTime } from './chatDisplay';

type Props = {
  message: MessageData;
  showDateDivider: boolean;
  canManage: boolean;
  onHide: (messageId: string) => void;
  onToggleHeart: (messageId: string) => void;
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
  myUserId,
  isUploadingPhotos = false,
  hasUploadFailed = false,
}: Props) => {
  const styles = useStyles(photoPostStyleFactory);
  const [viewerPhotoUrl, setViewerPhotoUrl] = useState<string | null>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const hasHearted = message.hearts.includes(myUserId);

  const handleCardLayout = (e: LayoutChangeEvent) => {
    setCardWidth(e.nativeEvent.layout.width);
  };

  const handleCarouselScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (cardWidth === 0) return;
    setCurrentPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / cardWidth));
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
            <View style={styles.cardInner} onLayout={handleCardLayout}>
              {message.hidden ? (
                <Text style={styles.hiddenText}>가려진 사진입니다</Text>
              ) : (
                <>
                  {message.photos.length > 0 && cardWidth > 0 && (
                    <View style={styles.carouselWrap}>
                      <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleCarouselScrollEnd}
                        style={styles.carousel}
                      >
                        {message.photos.map(photoUrl => (
                          <Pressable key={photoUrl} style={[styles.carouselItem, { width: cardWidth }]} onPress={() => setViewerPhotoUrl(photoUrl)}>
                            <Image source={{ uri: photoUrl }} style={styles.carouselImage} />
                            {(isUploadingPhotos || hasUploadFailed) && (
                              <View style={styles.uploadingOverlay}>
                                {hasUploadFailed ? <Text style={styles.failedText}>×</Text> : <ActivityIndicator color={color.grey0} />}
                              </View>
                            )}
                          </Pressable>
                        ))}
                      </ScrollView>
                      {message.photos.length > 1 && (
                        <View style={styles.photoCounter}>
                          <Text style={styles.photoCounterText}>
                            {currentPhotoIndex + 1} / {message.photos.length}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
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
                  </View>
                </>
              )}
            </View>
          </View>
          <Text style={styles.time}>{formatMessageTime(message.createdAt)}</Text>
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
    carouselWrap: {
      position: 'relative',
    },
    carousel: {
      height: 220,
    },
    carouselItem: {
      height: 220,
    },
    carouselImage: {
      width: '100%',
      height: '100%',
      backgroundColor: color.grey150,
    },
    photoCounter: {
      position: 'absolute',
      top: 10,
      right: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.label,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    photoCounterText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    uploadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    failedText: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
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
    time: {
      marginTop: 6,
      paddingHorizontal: 4,
      fontSize: fontSize('caption'),
      color: color.grey500,
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
  });
