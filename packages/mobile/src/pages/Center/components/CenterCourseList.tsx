import { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, semantic, radius, hit } from '@common/shared';
import type { CourseData, MembershipData, MyEnrollmentEntry } from '@common/shared';
import useApplyEnrollment from '../../../hooks/api/course/useApplyEnrollment';
import useCancelEnrollment from '../../../hooks/api/course/useCancelEnrollment';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';
import { formatSchedule, getCourseCardState, type CourseCardState } from '../centerDisplay';

const INITIAL_LIMIT = 4;
const STEP = 5;

const STATUS_LABEL: Record<CourseCardState, string> = {
  accepted: '수락 완료',
  pending: '대기중',
  rejected: '미신청',
  none: '미신청',
};

type Props = {
  welfareId: string;
  membership: MembershipData;
  courses: CourseData[];
  myEnrollments: MyEnrollmentEntry[];
};

const CenterCourseList = ({ welfareId, membership, courses, myEnrollments }: Props) => {
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const { mutate: apply, isPending: isApplying } = useApplyEnrollment(welfareId);
  const { mutate: cancel } = useCancelEnrollment(welfareId);

  const styles = useStyles(centerCourseListStyleFactory);

  const isMember = membership.role === 'member';
  const visibleCourses = courses.slice(0, limit);
  const rest = courses.length - limit;
  const showMore = rest > 0;
  const showFold = rest <= 0 && courses.length > INITIAL_LIMIT;
  const moreLabel = `강좌 ${Math.min(STEP, Math.max(rest, 0))}개 더 보기 (남은 ${Math.max(rest, 0)}개)`;

  const handleCancelAccepted = (course: CourseData) => {
    Alert.alert('신청 취소', `${course.name} 신청을 취소할까요?\n취소하면 다시 신청해야 합니다.`, [
      { text: '취소', style: 'cancel' },
      { text: '신청 취소', style: 'destructive', onPress: () => cancel(course._id) },
    ]);
  };

  return (
    <View style={styles.card}>
      {courses.length === 0 ? (
        <Text style={styles.emptyText}>{membership.role === 'teacher' ? '담당하는 강좌가 없습니다' : '아직 등록된 강좌가 없습니다'}</Text>
      ) : (
        visibleCourses.map(course => {
          const myEnrollment = myEnrollments.find(entry => entry.course === course._id);
          const cardState = isMember ? getCourseCardState(myEnrollment?.state) : 'none';

          return (
            <View key={course._id} style={styles.row}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{course.name}</Text>
                {isMember && (
                  <View style={[styles.statusTag, cardState === 'accepted' ? styles.statusTagOk : styles.statusTagNone]}>
                    <Text style={[styles.statusTagText, cardState === 'accepted' ? styles.statusTagTextOk : styles.statusTagTextNone]}>
                      {STATUS_LABEL[cardState]}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.meta}>
                {formatSchedule(course.schedule)} · {course.place || '장소 미정'}
              </Text>

              {!isMember && (
                <View style={styles.disabledButton}>
                  <Text style={styles.disabledButtonText}>신청은 회원만 할 수 있습니다</Text>
                </View>
              )}

              {isMember && cardState === 'none' && (
                <Pressable style={styles.mainButton} onPress={() => apply(course._id)} disabled={isApplying}>
                  <Text style={styles.mainButtonText}>이 강좌 신청하기</Text>
                </Pressable>
              )}

              {isMember && cardState === 'rejected' && (
                <View style={styles.rejectedCard}>
                  <Text style={styles.rejectedTitle}>이번에는 들어가지 못했습니다</Text>
                  <Text style={styles.rejectedBody}>이전 신청이 받아들여지지 않았습니다.</Text>
                  <View style={styles.rejectedButtonRow}>
                    <Pressable style={styles.retryButton} onPress={() => apply(course._id)} disabled={isApplying}>
                      <Text style={styles.retryButtonText}>다시 신청하기</Text>
                    </Pressable>
                    <Pressable style={styles.askButton} onPress={() => void Linking.openURL(`tel:${membership.welfare.phone}`)}>
                      <Text style={styles.askButtonText}>전화로 묻기</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {isMember && cardState === 'pending' && (
                <View style={styles.stateRow}>
                  <View style={styles.waitTag}>
                    <Text style={styles.waitTagText}>신청함{'\n'}복지관 확인 기다리는 중</Text>
                  </View>
                  <Pressable style={styles.cancelButton} onPress={() => cancel(course._id)}>
                    <Text style={styles.cancelButtonText}>신청 취소</Text>
                  </Pressable>
                </View>
              )}

              {isMember && cardState === 'accepted' && (
                <View style={styles.stateRow}>
                  <View style={styles.acceptedTag}>
                    <Text style={styles.acceptedTagText} lineBreakStrategyIOS="hangul-word">
                      수락 완료 · 다니고 있습니다
                    </Text>
                  </View>
                  <Pressable style={styles.cancelButton} onPress={() => handleCancelAccepted(course)}>
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })
      )}

      {showMore && (
        <Pressable style={styles.moreButton} onPress={() => setLimit(prev => prev + STEP)}>
          <Text style={styles.moreButtonText}>{moreLabel}</Text>
          <Text style={styles.moreButtonArrow}>▾</Text>
        </Pressable>
      )}

      {showFold && (
        <Pressable style={styles.moreButton} onPress={() => setLimit(INITIAL_LIMIT)}>
          <Text style={styles.foldButtonText}>처음처럼 접기</Text>
          <Text style={styles.foldButtonArrow}>▴</Text>
        </Pressable>
      )}
    </View>
  );
};

export default CenterCourseList;

const centerCourseListStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    emptyText: {
      padding: 18,
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      color: color.grey600,
    },
    card: {
      marginHorizontal: 16,
      marginBottom: 20,
      backgroundColor: semantic.bgSurface,
      borderWidth: 1,
      borderColor: semantic.border,
      borderTopWidth: 0,
      borderBottomLeftRadius: radius.mobileContainer,
      borderBottomRightRadius: radius.mobileContainer,
      overflow: 'hidden',
    },
    row: {
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: semantic.divider,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    name: {
      flex: 1,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    statusTag: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: radius.label,
    },
    statusTagOk: {
      backgroundColor: semantic.stateOkBg,
    },
    statusTagNone: {
      backgroundColor: color.grey150,
    },
    statusTagText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
    },
    statusTagTextOk: {
      color: semantic.stateOkFg,
    },
    statusTagTextNone: {
      color: color.grey600,
    },
    meta: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 5,
      color: color.grey600,
    },
    mainButton: {
      marginTop: 12,
      minHeight: hit.mobileCompact,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.actionBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.actionFg,
    },
    disabledButton: {
      marginTop: 12,
      minHeight: hit.mobileCompact,
      borderRadius: radius.mobileButton,
      backgroundColor: color.grey150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey500,
    },
    rejectedCard: {
      marginTop: 12,
      padding: 14,
      borderWidth: 1.5,
      borderColor: color.alertLine,
      borderLeftWidth: 5,
      borderRadius: radius.label,
      backgroundColor: color.alertTint,
    },
    rejectedTitle: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.alertText,
    },
    rejectedBody: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 6,
      color: color.grey700,
    },
    rejectedButtonRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },
    retryButton: {
      flex: 1,
      minHeight: hit.mobileCompact,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.actionBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    retryButtonText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: semantic.actionFg,
    },
    askButton: {
      minHeight: hit.mobileCompact,
      paddingHorizontal: 14,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.bgSurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    askButtonText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    stateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
    },
    waitTag: {
      flex: 1,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 10,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.stateWaitBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    waitTagText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      textAlign: 'center',
      color: semantic.stateWaitFg,
    },
    acceptedTag: {
      flex: 1,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 10,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.actionBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    acceptedTagText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      textAlign: 'center',
      color: semantic.actionFg,
    },
    cancelButton: {
      flex: 0,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.alertText,
    },
    moreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: hit.mobileMin,
      borderTopWidth: 1,
      borderTopColor: semantic.divider,
      backgroundColor: color.grey50,
    },
    moreButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
    moreButtonArrow: {
      fontSize: fontSize('xl'),
      color: color.navyDeep,
    },
    foldButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    foldButtonArrow: {
      fontSize: fontSize('xl'),
      color: color.grey600,
    },
  });
