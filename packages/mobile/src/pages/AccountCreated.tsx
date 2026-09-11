import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import { userInfoAtom } from '../store/user';
import PlaceholderAvatar from '../components/PlaceholderAvatar';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';
import type { RootStackParamList } from '../router';

const AccountCreated = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userInfo = useAtomValue(userInfoAtom);

  const styles = useStyles(accountCreatedStyleFactory);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileRow}>
          <PlaceholderAvatar size={84} borderRadius={22} label={userInfo.userName.charAt(0)} />
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileLabel}>카카오에서 가져온 이름</Text>
            <Text style={styles.profileName}>{userInfo.userName}</Text>
          </View>
        </View>

        <Text style={styles.heading}>시작할 준비가{'\n'}되었습니다</Text>
        <Text style={styles.description}>
          이제 다니시는 복지관을 연결해 주세요.{'\n'}복지관에서 주는{' '}
          <Text style={styles.descriptionBold}>QR</Text>을 찍으면 됩니다.
        </Text>

        <View style={styles.stepRow}>
          <View style={styles.stepBadgeDone}>
            <Text style={styles.stepBadgeDoneText}>1단계 끝</Text>
          </View>
          <Text style={styles.stepLabel}>계정 만들기</Text>
        </View>
        <View style={[styles.stepRow, styles.stepRowSpaced]}>
          <View style={styles.stepBadgeTodo}>
            <Text style={styles.stepBadgeTodoText}>2단계</Text>
          </View>
          <Text style={styles.stepLabel}>복지관 연결</Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>복지관 QR 찍기</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.secondaryButtonText}>나중에 하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

const accountCreatedStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.grey0,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    profileTextWrap: {
      flex: 1,
    },
    profileLabel: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey600,
    },
    profileName: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      marginTop: 4,
      color: semantic.textPrimary,
    },
    heading: {
      fontSize: fontSize('xxxl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xxxl') * 1.35,
      marginTop: 26,
      color: semantic.textPrimary,
    },
    description: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.7,
      marginTop: 14,
      color: semantic.textSecondary,
    },
    descriptionBold: {
      fontFamily: fontFamily('bold'),
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 22,
    },
    stepRowSpaced: {
      marginTop: 10,
    },
    stepBadgeDone: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 3,
      backgroundColor: color.navy,
    },
    stepBadgeDoneText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    stepBadgeTodo: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: color.grey400,
    },
    stepBadgeTodoText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    stepLabel: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('semibold'),
      color: color.grey600,
    },
    buttonGroup: {
      paddingHorizontal: 20,
      paddingBottom: 28,
      gap: 12,
    },
    primaryButton: {
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.ctaBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.ctaFg,
    },
    secondaryButton: {
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      backgroundColor: color.grey0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('semibold'),
      color: color.grey800,
    },
  });

export default AccountCreated;
