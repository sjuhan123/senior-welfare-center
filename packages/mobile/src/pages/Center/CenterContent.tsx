import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { color, semantic } from '@common/shared';
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
import CenterPausedNotice from './components/CenterPausedNotice';
import CenterHeaderCard from './components/CenterHeaderCard';
import MealBanner from './components/MealBanner';
import JoinMoreBanner from './components/JoinMoreBanner';
import WelfareSwitcherSheet from './components/WelfareSwitcherSheet';
import CenterCourseList from './components/CenterCourseList';
import CenterLostItemList from './components/CenterLostItemList/CenterLostItemList';

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isCenterOff ? (
        <CenterPausedNotice welfareName={membership.welfare.name} welfarePhone={membership.welfare.phone} />
      ) : (
        <>
          <ScrollView>
            <CenterHeaderCard
              welfareName={membership.welfare.name}
              isStaff={isStaff}
              roleLabel={ROLE_LABEL[membership.role]}
              displayName={displayName}
              statLabel={statLabel}
              statValue={statValue}
              sinceLabel={formatSince(membership.createdAt)}
              showSwitchButton={memberships.length > 1}
              onPressSwitch={() => setIsSwitcherOpen(true)}
            />

            <MealBanner
              todayMealText={todayMeal ? todayMeal.items.join(' · ') : '등록되지 않았습니다'}
              onPress={() => navigation.navigate('MealCalendar')}
            />

            {membership.role === 'member' && <JoinMoreBanner onPress={() => navigation.navigate('QrScan')} />}

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

          <WelfareSwitcherSheet
            visible={isSwitcherOpen}
            memberships={memberships}
            activeWelfareId={welfareId}
            onClose={() => setIsSwitcherOpen(false)}
            onSwitch={handleSwitchWelfare}
          />
        </>
      )}
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
  });
