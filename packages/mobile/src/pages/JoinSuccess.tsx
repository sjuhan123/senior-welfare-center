import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit, type MembershipRole } from '@common/shared';
import useStyles from '../hooks/styles/useStyles';
import type { RootStackParamList } from '../router';

const ROLE_LABEL: Record<MembershipRole, string> = {
  member: '회원',
  teacher: '선생님',
  admin: '관리자',
  super: '슈퍼관리자',
};

const JoinSuccess = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'JoinSuccess'>>();

  const styles = useStyles(({ fontSize, fontFamily }) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: color.grey0,
      },
      content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
      },
      checkBox: {
        width: 118,
        height: 118,
        borderRadius: radius.mobileContainer,
        backgroundColor: color.navy,
        alignItems: 'center',
        justifyContent: 'center',
      },
      checkText: {
        fontSize: fontSize('display') * 1.5,
        fontFamily: fontFamily('bold'),
        color: semantic.textOnDark,
      },
      heading: {
        fontSize: fontSize('display'),
        fontFamily: fontFamily('bold'),
        lineHeight: fontSize('display') * 1.35,
        marginTop: 26,
        textAlign: 'center',
        color: semantic.textPrimary,
      },
      welfareName: {
        fontSize: fontSize('xxl'),
        fontFamily: fontFamily('semibold'),
        lineHeight: fontSize('xxl') * 1.6,
        marginTop: 18,
        textAlign: 'center',
        color: color.grey700,
      },
      description: {
        fontSize: fontSize('md'),
        fontFamily: fontFamily('regular'),
        lineHeight: fontSize('md') * 1.7,
        marginTop: 18,
        textAlign: 'center',
        color: semantic.textMuted,
      },
      buttonGroup: {
        paddingHorizontal: 20,
        paddingBottom: 28,
      },
      primaryButton: {
        minHeight: hit.mobileLarge,
        borderRadius: radius.mobileButton,
        backgroundColor: color.navy,
        alignItems: 'center',
        justifyContent: 'center',
      },
      primaryButtonText: {
        fontSize: fontSize('xxl'),
        fontFamily: fontFamily('bold'),
        color: semantic.textOnDark,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkBox}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.heading}>복지관에{'\n'}연결되었습니다</Text>
        <Text style={styles.welfareName}>
          {params.welfareName}
          {'\n'}
          {ROLE_LABEL[params.role]} 님
        </Text>
        <Text style={styles.description}>이제 강좌를 신청하고{'\n'}공지방을 보실 수 있습니다.</Text>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.primaryButtonText}>강좌 보러 가기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default JoinSuccess;
