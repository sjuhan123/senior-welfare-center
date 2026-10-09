import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  welfareName: string;
  welfarePhone: string;
};

const CenterPausedNotice = ({ welfareName, welfarePhone }: Props) => {
  const styles = useStyles(centerPausedNoticeStyleFactory);

  return (
    <View>
      <View style={styles.pausedCard}>
        <Text style={styles.pausedTitle}>이 복지관은 지금{'\n'}이용이 멈춰 있습니다</Text>
        <Text style={styles.pausedBody}>{welfareName}에서 회원 자격을 잠시 멈추어 두었습니다. 이곳의 강좌와 대화방은 보이지 않습니다.</Text>
      </View>
      <Pressable style={styles.pausedCallButton} onPress={() => void Linking.openURL(`tel:${welfarePhone}`)}>
        <Text style={styles.pausedCallButtonText}>{welfareName}에 전화하기</Text>
      </Pressable>
    </View>
  );
};

export default CenterPausedNotice;

const centerPausedNoticeStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    pausedCard: {
      margin: 18,
      padding: 20,
      borderWidth: 1.5,
      borderColor: color.alertLine,
      borderTopWidth: 7,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.alertTint,
    },
    pausedTitle: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xl') * 1.4,
      color: color.alertText,
    },
    pausedBody: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.7,
      marginTop: 12,
      color: color.grey700,
    },
    pausedCallButton: {
      marginHorizontal: 18,
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.urgent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pausedCallButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
  });
