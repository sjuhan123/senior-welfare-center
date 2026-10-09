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
import { previewText, formatPreviewTime, roomTitle, sortRoomEntries } from '../../features/chat/chatDisplay';
import ChatPausedNotice from './components/ChatPausedNotice';
import ChatRoomRow from './components/ChatRoomRow';

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
          <ChatPausedNotice welfareName={membership.welfare.name} onPressWhy={() => navigation.navigate('MainTabs', { screen: 'Center' })} />
        )}

        <View style={styles.list}>
          {visibleEntries.map(({ room, latestMessage, unreadCount }) => (
            <ChatRoomRow
              key={room._id}
              title={roomTitle(room, courses, membership.welfare.name)}
              isNotice={room.type === 'notice'}
              previewLabel={previewText(latestMessage)}
              timeLabel={latestMessage ? formatPreviewTime(latestMessage.createdAt) : null}
              unreadCount={unreadCount}
              onPress={() => handlePressRoom(room)}
            />
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
    list: {
      backgroundColor: semantic.bgSurface,
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
