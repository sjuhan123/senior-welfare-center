import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  onPress: () => void;
};

const JoinMoreBanner = ({ onPress }: Props) => {
  const styles = useStyles(joinMoreBannerStyleFactory);

  return (
    <View style={styles.joinMoreWrap}>
      <Pressable style={styles.joinMoreButton} onPress={onPress}>
        <View style={styles.joinMoreTextWrap}>
          <Text style={styles.joinMoreTitle}>다른 복지관 가입하기</Text>
          <Text style={styles.joinMoreDesc}>복지관에서 제공하는 QR을 찍으면 됩니다</Text>
        </View>
        <Text style={styles.joinMoreChevron}>›</Text>
      </Pressable>
    </View>
  );
};

export default JoinMoreBanner;

const joinMoreBannerStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    joinMoreWrap: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 6,
    },
    joinMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      minHeight: hit.mobileLarge,
      paddingHorizontal: 18,
      backgroundColor: semantic.bgSurface,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
    },
    joinMoreTextWrap: {
      flex: 1,
    },
    joinMoreTitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    joinMoreDesc: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 3,
      color: color.grey600,
    },
    joinMoreChevron: {
      fontSize: fontSize('xxl'),
      color: color.grey500,
    },
  });
