import { useCallback, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { color, semantic, radius, hit } from '@common/shared';
import type { FeedPostListResponse, MembershipData } from '@common/shared';
import useGetRooms from '../../hooks/api/room/useGetRooms';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetFeedPosts from '../../hooks/api/room/useGetFeedPosts';
import { getSocket } from '../../libs/socket';
import { QUERY_KEYS } from '../../constant/queryKeys';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { roomEntityName, roomTitle } from '../Chat/chatDisplay';
import FeedPost from './FeedPost';

const INITIAL_LIMIT = 6;
const STEP = 6;

type Ack = { error?: string };
type Props = { membership: MembershipData };

const FeedContent = ({ membership }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const welfareId = membership.welfare._id;
  const myUserId = membership.userId;

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const { data: roomsData, refetch: refetchRooms } = useGetRooms(welfareId);
  const feedRooms = (roomsData?.data ?? []).map(entry => entry.room).filter(room => room.type === 'feed');

  const { data: coursesData } = useGetCourses(welfareId);
  const courses = coursesData?.data ?? [];

  const queryKey = [QUERY_KEYS.FEED_POSTS, welfareId, selectedRoomId];
  const { data: postsData, refetch: refetchPosts } = useGetFeedPosts(welfareId, selectedRoomId);
  const posts = postsData?.data ?? [];

  useFocusEffect(
    useCallback(() => {
      void refetchRooms();
      void refetchPosts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welfareId, selectedRoomId]),
  );

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await Promise.all([refetchRooms(), refetchPosts()]);
    setIsManualRefreshing(false);
  };

  const toggleHeartLocally = (messageId: string) => {
    queryClient.setQueryData<FeedPostListResponse>(queryKey, old => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map(post => {
          if (post._id !== messageId) return post;
          const hasHearted = post.hearts.includes(myUserId);
          return { ...post, hearts: hasHearted ? post.hearts.filter(id => id !== myUserId) : [...post.hearts, myUserId] };
        }),
      };
    });
  };

  /** 사진방 탭은 소켓 리스너가 없어서(요구사항: 남의 변경은 재진입 시 반영), 내 행동은 로컬 캐시만 낙관적으로 바꿈 */
  const handleToggleHeart = (messageId: string) => {
    toggleHeartLocally(messageId);
    const socket = getSocket();
    socket?.emit('toggle_heart', { messageId }, (response: Ack) => {
      if (response.error) {
        toggleHeartLocally(messageId);
        Alert.alert('안내', response.error);
      }
    });
  };

  const handleHide = (messageId: string) => {
    Alert.alert('메시지 가리기', '이 게시물을 가릴까요?\n가리면 목록에서 보이지 않습니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '가리기',
        style: 'destructive',
        onPress: () => {
          const socket = getSocket();
          socket?.emit('hide_message', { messageId }, (response: Ack) => {
            if (response.error) {
              Alert.alert('안내', response.error);
              return;
            }
            queryClient.setQueryData<FeedPostListResponse>(queryKey, old => {
              if (!old) return old;
              return { ...old, data: old.data.map(post => (post._id === messageId ? { ...post, hidden: true } : post)) };
            });
          });
        },
      },
    ]);
  };

  const handlePressComments = (messageId: string, roomId: string) => {
    navigation.navigate('PhotoComments', { welfareId, roomId, messageId });
  };

  const visiblePosts = posts.slice(0, limit);
  const rest = posts.length - limit;
  const showMore = rest > 0;
  const showFold = rest <= 0 && posts.length > INITIAL_LIMIT;
  const moreLabel = `사진 ${Math.min(STEP, Math.max(rest, 0))}개 더 보기 (남은 ${Math.max(rest, 0)}개)`;

  const styles = useStyles(feedContentStyleFactory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>사진방</Text>
      </View>

      {feedRooms.length > 0 && (
        <View style={styles.filterRowWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterRowContent}>
            <Pressable style={[styles.filterChip, selectedRoomId === null && styles.filterChipActive]} onPress={() => setSelectedRoomId(null)}>
              <Text style={[styles.filterChipText, selectedRoomId === null && styles.filterChipTextActive]}>전체</Text>
            </Pressable>
            {feedRooms.map(room => (
              <Pressable
                key={room._id}
                style={[styles.filterChip, selectedRoomId === room._id && styles.filterChipActive]}
                onPress={() => setSelectedRoomId(room._id)}
              >
                <Text style={[styles.filterChipText, selectedRoomId === room._id && styles.filterChipTextActive]}>
                  {roomEntityName(room, courses, membership.welfare.name)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        refreshControl={<RefreshControl refreshing={isManualRefreshing} onRefresh={() => void handleManualRefresh()} />}
      >
        {posts.length === 0 ? (
          <Text style={styles.emptyText}>아직 올라온 사진이 없습니다</Text>
        ) : (
          visiblePosts.map(post => {
            const room = feedRooms.find(r => r._id === post.room);
            const postRoomName = room ? roomTitle(room, courses, membership.welfare.name) : '사진방';
            return (
              <FeedPost
                key={post._id}
                post={post}
                roomName={postRoomName}
                myUserId={myUserId}
                onHide={handleHide}
                onToggleHeart={handleToggleHeart}
                onPressComments={handlePressComments}
              />
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

        <Text style={styles.hint}>사진을 올리는 것은 대화 탭의{'\n'}사진방 안에서 하실 수 있습니다.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedContent;

const feedContentStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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
    /** ScrollView 자체에 height를 줘도 안 먹는 경우가 있어서, 높이 고정된 View로 감싸고 ScrollView는 그 안을 꽉 채움 */
    filterRowWrap: {
      height: hit.mobileCompact + 28,
      backgroundColor: semantic.bgSurface,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    filterRow: {
      flex: 1,
    },
    filterRowContent: {
      alignItems: 'center',
      gap: 8,
      padding: 14,
    },
    filterChip: {
      flexShrink: 0,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 18,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: semantic.bgSurface,
    },
    filterChipActive: {
      backgroundColor: color.navy,
      borderColor: color.navy,
    },
    filterChipText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    filterChipTextActive: {
      color: semantic.textOnDark,
    },
    body: {
      flex: 1,
    },
    bodyContent: {
      padding: 14,
      gap: 14,
    },
    emptyText: {
      padding: 18,
      textAlign: 'center',
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      color: color.grey600,
    },
    moreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: hit.mobileMin,
      backgroundColor: color.grey50,
      borderRadius: radius.mobileContainer,
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
      padding: 4,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('sm') * 1.7,
      color: color.grey600,
    },
  });
