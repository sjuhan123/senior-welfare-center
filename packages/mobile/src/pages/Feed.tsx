import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, semantic } from '@common/shared';
import useGetMemberships from '../hooks/api/membership/useGetMemberships';
import EmptyWelfareState from '../components/EmptyWelfareState';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';

const Feed = () => {
  const { data } = useGetMemberships();
  const memberships = data?.data ?? [];

  const styles = useStyles(feedStyleFactory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>사진방</Text>
      </View>
      {memberships.length === 0 && (
        <EmptyWelfareState
          heading={'아직 올라온\n사진이 없습니다'}
          description={'복지관 강좌에 가입하시면\n같은 반 어르신들의 사진을\n보고 댓글도 다실 수 있습니다.'}
        />
      )}
    </SafeAreaView>
  );
};

const feedStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.grey0,
    },
    header: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 14,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    title: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
  });

export default Feed;
