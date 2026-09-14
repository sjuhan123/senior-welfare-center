import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, semantic } from '@common/shared';
import appIcon from '../../assets/icon.png';
import useGetMemberships from '../hooks/api/membership/useGetMemberships';
import EmptyWelfareState from '../components/EmptyWelfareState';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';

const Center = () => {
  const { data } = useGetMemberships();
  const memberships = data?.data ?? [];

  const styles = useStyles(centerStyleFactory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Image source={appIcon} style={styles.logo} />
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>우리복지관</Text>
          <Text style={styles.subtitle}>{memberships.length === 0 ? '아직 가입한 복지관이 없습니다' : memberships[0].welfare.name}</Text>
        </View>
      </View>
      {memberships.length === 0 && (
        <EmptyWelfareState
          heading={'복지관에 가입하면\n여기에 소식이 옵니다'}
          description={'복지관에서 제공하는\n네모난 QR을 찍으면 됩니다.'}
          showQrExample
        />
      )}
    </SafeAreaView>
  );
};

const centerStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.grey0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 18,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    logo: {
      width: 74,
      height: 74,
      borderRadius: 8,
    },
    headerTextWrap: {
      flex: 1,
    },
    title: {
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    subtitle: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 4,
      color: color.grey600,
    },
  });

export default Center;
