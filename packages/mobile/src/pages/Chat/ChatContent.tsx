import { useCallback, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import type { MembershipData, RoomData } from '@common/shared';
import useGetRooms from '../../hooks/api/room/useGetRooms';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { previewText, formatPreviewTime, roomTitle, sortRoomEntries } from './chatDisplay';

const INITIAL_LIMIT = 6;
const STEP = 6;

type Props = { membership: MembershipData };

const ChatContent = ({ membership }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const welfareId = membership.welfare._id;
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  const { data: roomsData, refetch } = useGetRooms(welfareId);
  const entries = sortRoomEntries(roomsData?.data ?? []);

  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  };

  const { data: coursesData } = useGetCourses(welfareId);
  const courses = coursesData?.data ?? [];

  const isCenterOff = membership.active === false;
  const visibleEntries = entries.slice(0, limit);
  const rest = entries.length - limit;
  const showMore = rest > 0;
  const showFold = rest <= 0 && entries.length > INITIAL_LIMIT;
  const moreLabel = `대화방 ${Math.min(STEP, Math.max(rest, 0))}개 더 보기 (남은 ${Math.max(rest, 0)}개)`;

  const styles = useStyles(chatContentStyleFactory);

  const handlePressRoom = (room: RoomData) => {
    const title = roomTitle(room, courses, membership.welfare.name);

    if (room.type === 'notice') {
      navigation.navigate('NoticeRoom', { welfareId, roomId: room._id, roomTitle: title });
      return;
    }

    if (room.type === 'chat' || room.type === 'feed') {
      navigation.navigate('ChatRoom', { welfareId, roomId: room._id, roomTitle: title, roomType: room.type });
      return;
    }

    Alert.alert('안내', '곧 만들어질 예정입니다');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>대화</Text>
        <Pressable style={styles.fontSizeButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Me' })}>
          <Text style={styles.fontSizeButtonText}>글씨 크기</Text>
        </Pressable>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={isManualRefreshing} onRefresh={() => void handleManualRefresh()} />}>
        {isCenterOff && (
          <View style={styles.pausedCard}>
            <Text style={styles.pausedTitle}>{membership.welfare.name} 대화방은 지금 보이지 않습니다</Text>
            <Text style={styles.pausedBody}>
              이용이 멈춰 있는 동안에는 그곳의 공지방과 이야기방이 잠깁니다. 다시 열리면 예전 글까지 그대로 보입니다.
            </Text>
            <Pressable style={styles.pausedButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Center' })}>
              <Text style={styles.pausedButtonText}>까닭 보기</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.list}>
          {visibleEntries.map(({ room, latestMessage, unreadCount }) => (
            <Pressable key={room._id} style={styles.row} onPress={() => handlePressRoom(room)}>
              <View style={styles.rowMain}>
                <View style={styles.rowNameLine}>
                  <Text style={styles.rowName} numberOfLines={1} ellipsizeMode="tail">
                    {roomTitle(room, courses, membership.welfare.name)}
                  </Text>
                  {room.type === 'notice' && (
                    <View style={styles.noticeBadge}>
                      <Text style={styles.noticeBadgeText}>공지</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.rowPreview} numberOfLines={1} ellipsizeMode="tail">
                  {previewText(latestMessage)}
                </Text>
              </View>
              <View style={styles.rowSide}>
                {latestMessage && <Text style={styles.rowTime}>{formatPreviewTime(latestMessage.createdAt)}</Text>}
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}

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

        <Text style={styles.hint}>글씨가 작으면 위의 &lsquo;글씨 크기&rsquo;를 누르세요.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatContent;

const chatContentStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: semantic.bgPage,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 18,
      backgroundColor: semantic.bgSurface,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    title: {
      flex: 1,
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    fontSizeButton: {
      flex: 0,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fontSizeButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('semibold'),
      color: semantic.textPrimary,
    },
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
    list: {
      backgroundColor: semantic.bgSurface,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: semantic.divider,
    },
    rowMain: {
      flex: 1,
      minWidth: 0,
    },
    rowNameLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    },
    rowName: {
      flexShrink: 1,
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    noticeBadge: {
      flexShrink: 0,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: color.navySoft,
    },
    noticeBadgeText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
    rowPreview: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      marginTop: 4,
      color: color.grey700,
    },
    rowSide: {
      flexShrink: 0,
      alignItems: 'flex-end',
      gap: 8,
    },
    rowTime: {
      fontSize: fontSize('caption'),
      color: color.grey500,
    },
    unreadBadge: {
      minWidth: 36,
      height: 36,
      paddingHorizontal: 10,
      borderRadius: 18,
      backgroundColor: color.brown,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadgeText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey0,
    },
    moreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: hit.mobileMin,
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
    hint: {
      padding: 18,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('sm') * 1.7,
      color: color.grey600,
    },
  });
