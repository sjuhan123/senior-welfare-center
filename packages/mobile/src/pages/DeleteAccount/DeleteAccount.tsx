import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import { userInfoAtom, resetUserInfoAtom } from '../../store/user';
import { isUserTokenValidAtom } from '../../store/auth';
import { deleteAccount } from '../../hooks/api/auth/useDeleteAccount';
import { clearUserToken, clearRefreshToken } from '../../utills/persistentStorage';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';

const DeleteAccount = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userInfo = useAtomValue(userInfoAtom);
  const resetUserInfo = useSetAtom(resetUserInfoAtom);
  const setIsUserTokenValid = useSetAtom(isUserTokenValidAtom);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const styles = useStyles(deleteAccountStyleFactory);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await clearUserToken();
      await clearRefreshToken();
      setIsUserTokenValid(false);
      resetUserInfo();
      setStep(3);
    } catch {
      Alert.alert('안내', '계정을 지우지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (step === 3) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneContent}>
          <View style={styles.checkBox}>
            <Text style={styles.checkText}>✓</Text>
          </View>
          <Text style={styles.doneHeading}>계정을 지웠습니다</Text>
          <Text style={styles.doneDescription}>
            그동안 이용해 주셔서 고맙습니다.{'\n'}다시 오시면 언제든 가입하실 수{'\n'}있습니다.
          </Text>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.primaryButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Auth' }] })}>
            <Text style={styles.primaryButtonText}>처음 화면으로</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>계정 지우기</Text>
        <Text style={styles.stepLabel}>{step}/2</Text>
      </View>

      {step === 1 ? (
        <>
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            <Text style={styles.bigHeading}>이렇게 됩니다</Text>
            <View style={styles.lossCard}>
              <Text style={styles.lossTitle}>없어지는 것</Text>
              <Text style={styles.lossText}>
                가입한 복지관들{'\n'}신청한 강좌와 대기 중인 신청{'\n'}대화방에서 나가고 알림도 멈춤
              </Text>
            </View>
            <View style={styles.keepCard}>
              <Text style={styles.keepTitle}>그대로 남는 것</Text>
              <Text style={styles.keepText}>사진방에 올린 사진과 글{'\n'}대화방에 쓴 말</Text>
              <Text style={styles.keepNote}>이름은 &lsquo;나간 회원&rsquo;으로 바뀝니다. 먼저 지우고 싶은 사진이 있으면 지금 지우고 오세요.</Text>
            </View>
            <Text style={styles.footNote}>다시 쓰시려면 카카오로 처음부터{'\n'}가입하고 QR을 다시 찍으셔야 합니다.</Text>
          </ScrollView>
          <View style={styles.buttonGroup}>
            <Pressable style={styles.dangerOutlineButton} onPress={() => setStep(2)}>
              <Text style={styles.dangerOutlineButtonText}>알겠습니다, 다음</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>그냥 쓰겠습니다</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={styles.body}>
            <Text style={styles.bigHeading}>정말 지울까요?</Text>
            <Text style={styles.step2Desc}>{userInfo.userName} 님의 우리복지관 계정을 지웁니다. 되돌릴 수 없습니다.</Text>
            <View style={styles.recordCard}>
              <Text style={styles.recordTitle}>복지관에 남는 기록</Text>
              <Text style={styles.recordText}>
                복지관 직원 화면에는 30일 동안 &lsquo;나간 회원&rsquo;으로만 보이고, 전화번호는 가려집니다. 그 뒤 아주 지워집니다.
              </Text>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable style={styles.dangerButton} onPress={() => void handleDelete()} disabled={isDeleting}>
              <Text style={styles.dangerButtonText}>네, 지웁니다</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>아니요, 그만두겠습니다</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const deleteAccountStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.grey0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    backButton: {
      width: hit.mobileCompact,
      height: hit.mobileCompact,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      fontSize: fontSize('xl'),
    },
    headerTitle: {
      flex: 1,
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    stepLabel: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    body: {
      flex: 1,
      padding: 20,
    },
    bodyContent: {
      padding: 20,
    },
    bigHeading: {
      fontSize: fontSize('xxxl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xxxl') * 1.4,
      color: semantic.textPrimary,
    },
    lossCard: {
      marginTop: 18,
      borderWidth: 1.5,
      borderColor: color.alertLine,
      borderTopWidth: 7,
      borderTopColor: color.alert,
      borderRadius: radius.label,
      backgroundColor: color.alertTint,
      padding: 18,
    },
    lossTitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.alertText,
    },
    lossText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.8,
      marginTop: 9,
      color: color.grey700,
    },
    keepCard: {
      marginTop: 12,
      borderWidth: 1.5,
      borderColor: color.grey300,
      borderRadius: radius.label,
      backgroundColor: color.grey50,
      padding: 18,
    },
    keepTitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    keepText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.8,
      marginTop: 9,
      color: color.grey700,
    },
    keepNote: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('sm') * 1.7,
      marginTop: 10,
      color: color.grey600,
    },
    footNote: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.75,
      marginTop: 18,
      color: color.grey700,
    },
    step2Desc: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.7,
      marginTop: 16,
      color: color.grey700,
    },
    recordCard: {
      marginTop: 22,
      borderWidth: 1.5,
      borderColor: color.grey300,
      borderRadius: radius.label,
      padding: 18,
    },
    recordTitle: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    recordText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.75,
      marginTop: 7,
      color: color.grey700,
    },
    buttonGroup: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      gap: 11,
    },
    primaryButton: {
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: color.navy,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    dangerOutlineButton: {
      minHeight: hit.mobileLarge,
      borderWidth: 1.5,
      borderColor: color.alertLine,
      borderRadius: radius.mobileButton,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dangerOutlineButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.alertText,
    },
    dangerButton: {
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: color.alert,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dangerButtonText: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    secondaryButton: {
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    doneContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    checkBox: {
      width: 112,
      height: 112,
      borderRadius: 56,
      backgroundColor: color.grey150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkText: {
      fontSize: fontSize('display') * 1.5,
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    doneHeading: {
      fontSize: fontSize('xxxl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xxxl') * 1.4,
      marginTop: 24,
      textAlign: 'center',
      color: semantic.textPrimary,
    },
    doneDescription: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.75,
      marginTop: 16,
      textAlign: 'center',
      color: color.grey700,
    },
  });

export default DeleteAccount;
