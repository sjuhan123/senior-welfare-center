import { useEffect, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { color, semantic, radius, hit } from '@common/shared';
import type { MembershipData } from '@common/shared';
import { userInfoAtom } from '../../store/user';
import { activeWelfareIdAtom } from '../../store/activeWelfare';
import useGetMemberships from '../../hooks/api/membership/useGetMemberships';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetMyEnrollments from '../../hooks/api/course/useGetMyEnrollments';
import useGetLostItems from '../../hooks/api/lostItem/useGetLostItems';
import useGetMeals from '../../hooks/api/meal/useGetMeals';
import { getRooms } from '../../hooks/api/room/useGetRooms';
import { QUERY_KEYS } from '../../constant/queryKeys';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { toIso, formatSince, ROLE_LABEL } from './centerDisplay';
import CenterCourseList from './CenterCourseList';
import CenterLostItemList from './CenterLostItemList';

const TODAY_ISO = toIso(new Date());
const TODAY_MONTH = TODAY_ISO.slice(0, 7);

type Props = { membership: MembershipData };

const CenterContent = ({ membership }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const welfareId = membership.welfare._id;

  /** 대화 탭 방 목록을 미리 캐시에 채워둠 */
  const queryClient = useQueryClient();
  useEffect(() => {
    void queryClient.prefetchQuery({ queryKey: [QUERY_KEYS.ROOMS, welfareId], queryFn: () => getRooms(welfareId) });
  }, [queryClient, welfareId]);

  const { data: coursesData } = useGetCourses(welfareId);
  const courses = coursesData?.data ?? [];

  const { data: enrollmentsData } = useGetMyEnrollments(welfareId);
  const myEnrollments = enrollmentsData?.data ?? [];

  const { data: lostItemsData } = useGetLostItems(welfareId);
  const lostItems = (lostItemsData?.data ?? []).filter(lostItem => !lostItem.claimed);

  const { data: mealsData } = useGetMeals(welfareId, TODAY_MONTH);
  const todayMeal = (mealsData?.data ?? []).find(meal => meal.date === TODAY_ISO) ?? null;

  const isStaff = membership.role !== 'member';
  const isTeacher = membership.role === 'teacher';
  const isAdmin = membership.role === 'admin' || membership.role === 'super';
  const isCenterOff = membership.active === false;

  const visibleCourses = isTeacher ? courses.filter(course => course.teacher === membership.userId) : courses;
  const acceptedCount = myEnrollments.filter(entry => entry.state === 'accepted').length;

  const courseHint = isTeacher ? '제가 가르치는 강좌입니다' : isAdmin ? '제가 관리하는 강좌입니다' : '다니는 강좌가 위에 있습니다';
  const statLabel = isTeacher ? '가르치는 강좌' : isAdmin ? '관리 중인 강좌' : '다니는 강좌';
  const statValue = isStaff ? visibleCourses.length : acceptedCount;

  const userInfo = useAtomValue(userInfoAtom);
  const nameSuffix = isTeacher ? '선생님' : isAdmin ? '담당자' : '님';
  const displayName = `${userInfo.userName} ${nameSuffix}`;

  const setActiveWelfareId = useSetAtom(activeWelfareIdAtom);
  const { data: membershipsData } = useGetMemberships();
  const memberships = membershipsData?.data ?? [];
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const handleSwitchWelfare = (targetWelfareId: string) => {
    setActiveWelfareId(targetWelfareId);
    setIsSwitcherOpen(false);
  };

  const styles = useStyles(centerContentStyleFactory);

  return isCenterOff ? (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.pausedCard}>
        <Text style={styles.pausedTitle}>이 복지관은 지금{'\n'}이용이 멈춰 있습니다</Text>
        <Text style={styles.pausedBody}>
          {membership.welfare.name}에서 회원 자격을 잠시 멈추어 두었습니다. 이곳의 강좌와 대화방은 보이지 않습니다.
        </Text>
      </View>
      <Pressable style={styles.pausedCallButton} onPress={() => void Linking.openURL(`tel:${membership.welfare.phone}`)}>
        <Text style={styles.pausedCallButtonText}>{membership.welfare.name}에 전화하기</Text>
      </Pressable>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <Text style={styles.welfareName}>{membership.welfare.name}</Text>
            {isStaff && (
              <View style={styles.staffTag}>
                <Text style={styles.staffTagText}>{ROLE_LABEL[membership.role]}</Text>
              </View>
            )}
            {memberships.length > 1 && (
              <Pressable style={styles.switchButton} onPress={() => setIsSwitcherOpen(true)}>
                <Text style={styles.switchButtonIcon}>⇅</Text>
                <Text style={styles.switchButtonText}>바꾸기</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.confirmedTag}>
              <Text style={styles.confirmedTagText}>회원 확인됨</Text>
            </View>
            <Text style={styles.roleName}>{displayName}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statText}>
              {statLabel} <Text style={styles.statValue}>{statValue}개</Text>
            </Text>
            <View style={styles.statDivider} />
            <Text style={styles.statText}>{formatSince(membership.createdAt)}</Text>
          </View>
        </View>

        <Pressable style={styles.mealBanner} onPress={() => navigation.navigate('MealCalendar')}>
          <Text style={styles.mealBannerLabel}>오늘의 밥</Text>
          <Text style={styles.mealBannerValue} numberOfLines={1} ellipsizeMode="tail">
            {todayMeal ? todayMeal.items.join(' · ') : '등록되지 않았습니다'}
          </Text>
          <Text style={styles.mealBannerChevron}>›</Text>
        </Pressable>

        {membership.role === 'member' && (
          <View style={styles.joinMoreWrap}>
            <Pressable style={styles.joinMoreButton} onPress={() => navigation.navigate('QrScan')}>
              <View style={styles.joinMoreTextWrap}>
                <Text style={styles.joinMoreTitle}>다른 복지관 가입하기</Text>
                <Text style={styles.joinMoreDesc}>복지관에서 제공하는 QR을 찍으면 됩니다</Text>
              </View>
              <Text style={styles.joinMoreChevron}>›</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.sectionHeaderRowCourse}>
          <View style={styles.sectionBullet} />
          <Text style={styles.sectionTitle}>강좌 {courses.length}개</Text>
          <Text style={styles.sectionHint}>{courseHint}</Text>
        </View>
        <CenterCourseList welfareId={welfareId} membership={membership} courses={visibleCourses} myEnrollments={myEnrollments} />

        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionBullet} />
          <Text style={styles.sectionTitle}>잃어버린 물건</Text>
          <Text style={styles.sectionHint}>{lostItems.length}건</Text>
        </View>
        <CenterLostItemList lostItems={lostItems} />
        {lostItems.length > 0 && (
          <Text style={styles.lostItemNote} lineBreakStrategyIOS="hangul-word">
            내 물건이 보이면 복지관에 말씀하시거나 전화하시면 됩니다.
          </Text>
        )}
      </ScrollView>

      <Modal visible={isSwitcherOpen} transparent animationType="fade" onRequestClose={() => setIsSwitcherOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setIsSwitcherOpen(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>가입한 복지관</Text>
              <Pressable style={styles.sheetCloseButton} onPress={() => setIsSwitcherOpen(false)}>
                <Text style={styles.sheetCloseButtonText}>닫기</Text>
              </Pressable>
            </View>
            <ScrollView>
              {memberships.map(m => {
                const isActive = m.welfare._id === welfareId;
                return (
                  <Pressable
                    key={m._id}
                    style={[styles.sheetItem, isActive && styles.sheetItemActive]}
                    onPress={() => handleSwitchWelfare(m.welfare._id)}
                  >
                    <View style={styles.sheetItemTextWrap}>
                      <Text style={styles.sheetItemName}>{m.welfare.name}</Text>
                      <Text style={styles.sheetItemMeta}>
                        {ROLE_LABEL[m.role]} · {formatSince(m.createdAt)}
                      </Text>
                    </View>
                    {isActive && <Text style={styles.sheetItemMark}>선택됨</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default CenterContent;

const centerContentStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: semantic.bgPage,
    },
    headerCard: {
      backgroundColor: semantic.bgSurface,
      paddingHorizontal: 18,
      paddingTop: 20,
      borderBottomWidth: 1,
      borderBottomColor: semantic.border,
    },
    switchButton: {
      flexShrink: 0,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 12,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchButtonIcon: {
      fontSize: fontSize('lg'),
      color: color.grey700,
    },
    switchButtonText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    sheetBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    sheet: {
      maxHeight: '72%',
      backgroundColor: semantic.bgSurface,
      borderTopWidth: 2,
      borderTopColor: color.navy,
      borderTopLeftRadius: radius.sheet,
      borderTopRightRadius: radius.sheet,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 18,
    },
    sheetTitle: {
      flex: 1,
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sheetCloseButton: {
      minHeight: hit.mobileCompact,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetCloseButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sheetItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginHorizontal: 16,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
      padding: 16,
    },
    sheetItemActive: {
      borderColor: color.navy,
      backgroundColor: color.navySoft,
    },
    sheetItemTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    sheetItemName: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sheetItemMeta: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 4,
      color: color.grey600,
    },
    sheetItemMark: {
      flexShrink: 0,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    welfareName: {
      flex: 1,
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    staffTag: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radius.label,
      backgroundColor: color.navy,
    },
    staffTagText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey0,
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      marginTop: 10,
    },
    confirmedTag: {
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.label,
      backgroundColor: semantic.stateOkBg,
    },
    confirmedTagText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: semantic.stateOkFg,
    },
    roleName: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('semibold'),
      color: color.grey700,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 18,
      marginHorizontal: -18,
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: semantic.divider,
    },
    statText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey700,
    },
    statValue: {
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    statDivider: {
      width: 1,
      height: 14,
      backgroundColor: color.grey300,
    },
    mealBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 18,
      paddingVertical: 16,
      backgroundColor: color.brown,
    },
    mealBannerLabel: {
      flexShrink: 0,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: 'rgba(255,255,255,0.82)',
    },
    mealBannerValue: {
      flexShrink: 1,
      flexGrow: 1,
      minWidth: 0,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey0,
    },
    mealBannerChevron: {
      flexShrink: 0,
      fontSize: fontSize('xxl'),
      color: color.grey0,
    },
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
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 10,
      marginHorizontal: 18,
      marginTop: 22,
      marginBottom: 10,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: color.navy,
    },
    /** 강좌 목록 카드의 흰 배경이 이 헤더의 borderBottom까지 바로 이어지도록 marginBottom을 없앰 */
    sectionHeaderRowCourse: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 10,
      marginHorizontal: 18,
      marginTop: 22,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: color.navy,
    },
    sectionBullet: {
      width: 12,
      height: 12,
      backgroundColor: color.navy,
    },
    sectionTitle: {
      flex: 1,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sectionHint: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      color: color.grey600,
    },
    lostItemNote: {
      marginHorizontal: 18,
      marginBottom: 20,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('sm') * 1.7,
      color: color.grey600,
    },
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
