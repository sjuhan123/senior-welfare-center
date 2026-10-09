import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  welfareName: string;
  onPressWhy: () => void;
};

const ChatPausedNotice = ({ welfareName, onPressWhy }: Props) => {
  const styles = useStyles(chatPausedNoticeStyleFactory);

  return (
    <View style={styles.pausedCard}>
      <Text style={styles.pausedTitle}>{welfareName} 대화방은 지금 보이지 않습니다</Text>
      <Text style={styles.pausedBody}>이용이 멈춰 있는 동안에는 그곳의 공지방과 이야기방이 잠깁니다. 다시 열리면 예전 글까지 그대로 보입니다.</Text>
      <Pressable style={styles.pausedButton} onPress={onPressWhy}>
        <Text style={styles.pausedButtonText}>까닭 보기</Text>
      </Pressable>
    </View>
  );
};

export default ChatPausedNotice;

const chatPausedNoticeStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    pausedCard: {
      margin: 14,
      borderWidth: 1.5,
      borderColor: color.alertLine,
      borderLeftWidth: 7,
      borderRadius: radius.label,
      backgroundColor: color.alertTint,
      padding: 16,
    },
    pausedTitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('lg') * 1.45,
      color: color.alertText,
    },
    pausedBody: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.7,
      marginTop: 7,
      color: color.grey700,
    },
    pausedButton: {
      marginTop: 13,
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: color.alertText,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pausedButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
  });
