import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { color, semantic, radius } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import PhotoViewerModal from './PhotoViewerModal';

type Props = {
  photos: string[];
  height?: number;
  /** 사진이 아직 S3 업로드 중인지(낙관적 전송 중 로컬 미리보기 위에 스피너 표시) */
  isUploadingPhotos?: boolean;
  /** 사진 업로드가 실패했는지(스피너 대신 X 표시) */
  hasUploadFailed?: boolean;
  /** 현재 캐러셀에 보이는 사진이 바뀔 때마다 알려줌(공유 버튼이 "지금 보고 있는 사진"을 알아야 해서) */
  onIndexChange?: (index: number) => void;
};

/** 사진방 게시물의 가로 스크롤 캐러셀. 컨테이너 실측 폭에 맞춰 사진이 폭을 꽉 채우고, 2장 이상이면 우측 상단에 장수 표시. 탭하면 전체화면 보기. */
const PhotoCarousel = ({ photos, height = 220, isUploadingPhotos = false, hasUploadFailed = false, onIndexChange }: Props) => {
  const styles = useStyles(photoCarouselStyleFactory);
  const [viewerPhotoUrl, setViewerPhotoUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width === 0) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
    onIndexChange?.(index);
  };

  if (photos.length === 0) return null;

  return (
    <View style={styles.wrap} onLayout={handleLayout}>
      {width > 0 && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScrollEnd} style={{ height }}>
          {photos.map(photoUrl => (
            <Pressable key={photoUrl} style={{ width, height }} onPress={() => setViewerPhotoUrl(photoUrl)}>
              <Image source={{ uri: photoUrl }} style={styles.image} />
              {(isUploadingPhotos || hasUploadFailed) && (
                <View style={styles.overlay}>
                  {hasUploadFailed ? <Text style={styles.failedText}>×</Text> : <ActivityIndicator color={color.grey0} />}
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
      {photos.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {photos.length}
          </Text>
        </View>
      )}

      <PhotoViewerModal photoUrl={viewerPhotoUrl} onClose={() => setViewerPhotoUrl(null)} />
    </View>
  );
};

export default PhotoCarousel;

const photoCarouselStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    wrap: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: color.grey150,
    },
    overlay: {
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
    counter: {
      position: 'absolute',
      top: 10,
      right: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.label,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    counterText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
  });
