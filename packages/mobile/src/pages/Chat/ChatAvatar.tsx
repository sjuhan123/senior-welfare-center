import { Image, StyleSheet, Text, View } from 'react-native';
import { color } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';

type Props = {
  size: number;
  borderRadius: number;
  initial: string;
  /** 보낸 사람이 직접 설정한 프로필 사진(없으면 이니셜 표시) */
  photoUrl?: string;
};

/** 대화방·사진방·댓글에서 공통으로 쓰는 보낸 사람 아바타. 사진이 있으면 사진을, 없으면 이니셜을 보여줌 */
const ChatAvatar = ({ size, borderRadius, initial, photoUrl }: Props) => {
  const styles = useStyles(chatAvatarStyleFactory);

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius }]}>
      {photoUrl ? <Image source={{ uri: photoUrl }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{initial}</Text>}
    </View>
  );
};

export default ChatAvatar;

const chatAvatarStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    avatar: {
      flexShrink: 0,
      backgroundColor: color.grey150,
      borderWidth: 1,
      borderColor: color.grey300,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
  });
