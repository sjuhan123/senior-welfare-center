import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { color, semantic, radius, hit, scale } from '@common/shared';
import { userInfoAtom, resetUserInfoAtom } from '../store/user';
import { textScaleAtom } from '../store/textScale';
import { isUserTokenValidAtom } from '../store/auth';
import useGetMemberships from '../hooks/api/membership/useGetMemberships';
import { deleteMembership } from '../hooks/api/membership/useDeleteMembership';
import { deleteAccount } from '../hooks/api/auth/useDeleteAccount';
import { clearUserToken, clearRefreshToken } from '../utills/persistentStorage';
import PlaceholderAvatar from '../components/PlaceholderAvatar';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';
import { QUERY_KEYS } from '../constant/queryKeys';
import type { RootStackParamList } from '../router';

const SCALE_LABELS = ['보통', '크게', '더 크게'] as const;

const formatSince = (isoDate: string) => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return '가입일 확인 중';
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월부터`;
};

const Me = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const userInfo = useAtomValue(userInfoAtom);
  const resetUserInfo = useSetAtom(resetUserInfoAtom);
  const setIsUserTokenValid = useSetAtom(isUserTokenValidAtom);
  const [textScale, setTextScale] = useAtom(textScaleAtom);
  const { data } = useGetMemberships();
  const memberships = data?.data ?? [];

  const handleLeaveMembership = (membershipId: string, welfareName: string) => {
    Alert.alert('탈퇴하기', `${welfareName}에서 탈퇴할까요?\n탈퇴하면 공지와 강좌를 볼 수 없습니다.`, [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          await deleteMembership(membershipId);
          void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERSHIPS] });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('우리복지관 계정 지우기', '계정을 지우면 되돌릴 수 없습니다.\n정말 지울까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '계정 지우기',
        style: 'destructive',
        onPress: async () => {
          await deleteAccount();
          await clearUserToken();
          await clearRefreshToken();
          setIsUserTokenValid(false);
          resetUserInfo();
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        },
      },
    ]);
  };

  const styles = useStyles(meStyleFactory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <Text style={styles.headerTitle}>내 정보</Text>

        <View style={styles.profileRow}>
          <PlaceholderAvatar size={84} borderRadius={22} label={userInfo.userName.charAt(0)} />
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{userInfo.userName}</Text>
          </View>
          <Pressable style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>사진{'\n'}바꾸기</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionBullet} />
            <Text style={styles.sectionTitle}>글씨 크기</Text>
          </View>
          <Text style={styles.sectionDesc}>누르면 바로 바뀝니다.</Text>
          <View style={styles.scaleRow}>
            {scale.mobile.userScale.map((value, index) => {
              const active = textScale === value;
              return (
                <Pressable key={value} style={[styles.scaleButton, active && styles.scaleButtonActive]} onPress={() => setTextScale(value)}>
                  <Text style={[styles.scaleButtonText, active && styles.scaleButtonTextActive]}>{SCALE_LABELS[index]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {memberships.length === 0 ? (
          <View style={styles.noCenterSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionBullet} />
              <Text style={styles.sectionTitle}>가입한 복지관 없음</Text>
            </View>
            <Text style={styles.noCenterDesc}>가입하시면 공지와 강좌 신청,{'\n'}알림을 모두 쓰실 수 있습니다.</Text>
            <Pressable style={styles.noCenterPrimaryButton} onPress={() => navigation.navigate('QrScan')}>
              <Text style={styles.noCenterPrimaryButtonText}>QR 찍어서 가입하기</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionBullet} />
              <Text style={styles.sectionTitle}>복지관에 전화</Text>
            </View>
            <Text style={styles.sectionDesc}>{memberships[0].welfare.phone}</Text>
            <Pressable style={styles.callButton} onPress={() => void Linking.openURL(`tel:${memberships[0].welfare.phone}`)}>
              <Text style={styles.callButtonText}>전화 걸기</Text>
            </Pressable>
          </View>
        )}

        {memberships.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionBullet} />
              <Text style={styles.sectionTitle}>가입한 복지관</Text>
            </View>
            <Text style={styles.sectionDesc}>탈퇴하면 그 복지관의 공지와{'\n'}강좌를 볼 수 없습니다.</Text>
            <View style={styles.centerList}>
              {memberships.map(membership => (
                <View key={membership._id} style={styles.centerCard}>
                  <Text style={styles.centerName}>{membership.welfare.name}</Text>
                  <Text style={styles.centerMeta}>
                    회원번호 {membership.userId.slice(-4)} · {formatSince(membership.createdAt)}
                  </Text>
                  <Pressable style={styles.leaveButton} onPress={() => handleLeaveMembership(membership._id, membership.welfare.name)}>
                    <Text style={styles.leaveButtonText}>탈퇴하기</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.dangerSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionBullet} />
            <Text style={styles.sectionTitle}>앱 그만 쓰기</Text>
          </View>
          <Text style={styles.sectionDesc}>앱만 지우면 계정은 남아 있습니다.{'\n'}아주 그만 쓰시려면 아래를 누르세요.</Text>
          <Pressable style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteAccountButtonText}>우리복지관 계정 지우기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const meStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.grey0,
    },
    headerTitle: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 18,
      borderBottomWidth: 9,
      borderBottomColor: semantic.divider,
    },
    profileTextWrap: {
      flex: 1,
    },
    profileName: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    changePhotoButton: {
      flex: 0,
      minHeight: hit.mobileMin,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      alignItems: 'center',
      justifyContent: 'center',
    },
    changePhotoText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
      textAlign: 'center',
    },
    section: {
      padding: 18,
      borderBottomWidth: 9,
      borderBottomColor: semantic.divider,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    sectionBullet: {
      width: 10,
      height: 10,
      backgroundColor: color.navy,
    },
    sectionTitle: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sectionDesc: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('sm') * 1.6,
      marginTop: 6,
      color: color.grey600,
    },
    scaleRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
    scaleButton: {
      flex: 1,
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      backgroundColor: color.grey0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scaleButtonActive: {
      borderColor: color.navy,
      backgroundColor: color.navySoft,
    },
    scaleButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    scaleButtonTextActive: {
      color: color.navyDeep,
    },
    callButton: {
      marginTop: 14,
      minHeight: hit.mobileMin,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.urgent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    callButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    noCenterSection: {
      padding: 18,
      borderBottomWidth: 9,
      borderBottomColor: semantic.divider,
      backgroundColor: color.grey50,
    },
    noCenterDesc: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('base') * 1.7,
      marginTop: 8,
      color: color.grey700,
    },
    noCenterPrimaryButton: {
      marginTop: 14,
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.ctaBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noCenterPrimaryButtonText: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.ctaFg,
    },
    centerList: {
      marginTop: 14,
      gap: 12,
    },
    centerCard: {
      borderWidth: 1,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      padding: 16,
    },
    centerName: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    centerMeta: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 5,
      color: color.grey600,
    },
    leaveButton: {
      marginTop: 12,
      minHeight: hit.mobileCompact,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      backgroundColor: color.grey0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    leaveButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.urgent,
    },
    dangerSection: {
      padding: 18,
      paddingBottom: 36,
    },
    deleteAccountButton: {
      marginTop: 14,
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      backgroundColor: color.grey0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteAccountButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
  });

export default Me;
