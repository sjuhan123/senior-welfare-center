import { StyleSheet, Text, View } from 'react-native';
import { color, semantic } from '@common/shared';
import useGetMemberships from '../hooks/api/membership/useGetMemberships';
import EmptyWelfareState from '../components/EmptyWelfareState';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';

const Chat = () => {
  const { data } = useGetMemberships();
  const memberships = data?.data ?? [];

  const styles = useStyles(chatStyleFactory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>대화</Text>
      </View>
      {memberships.length === 0 && (
        <EmptyWelfareState
          heading={'아직 대화방이\n없습니다'}
          description={'복지관에 가입하시면\n공지방과 이야기방이\n여기에 생깁니다.'}
          showCallButton
          callButtonLabel="복지관에 전화하기"
        />
      )}
    </View>
  );
};

const chatStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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

export default Chat;
