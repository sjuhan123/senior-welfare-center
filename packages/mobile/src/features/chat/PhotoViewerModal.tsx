import { Image, Modal, Pressable, StyleSheet } from 'react-native';
import useStyles from '../../hooks/styles/useStyles';

type Props = {
  photoUrl: string | null;
  onClose: () => void;
};

/** 사진 썸네일을 탭했을 때 뜨는 전체화면 뷰어. PhotoCarousel, MessageBubble에서 공유. */
const PhotoViewerModal = ({ photoUrl, onClose }: Props) => {
  const styles = useStyles(photoViewerModalStyleFactory);

  return (
    <Modal visible={!!photoUrl} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.viewerBackdrop} onPress={onClose}>
        {!!photoUrl && <Image source={{ uri: photoUrl }} style={styles.viewerImage} resizeMode="contain" />}
      </Pressable>
    </Modal>
  );
};

export default PhotoViewerModal;

const photoViewerModalStyleFactory = () =>
  StyleSheet.create({
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
