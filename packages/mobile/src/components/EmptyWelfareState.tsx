import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';
import type { RootStackParamList } from '../router';

// "이런 표시를 찾으시면 됩니다" 예시 카드에 쓰는 4x4 무늬. 실제 QR이 아니라
// 프로토타입에 있는 고정된 장식용 패턴을 그대로 옮김.
const QR_EXAMPLE_PATTERN = [
  [1, 1, 0, 1],
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 0, 1, 1],
];

type Props = {
  heading: string;
  description: string;
  showQrExample?: boolean;
  showCallButton?: boolean;
  callButtonLabel?: string;
};

const EmptyWelfareState = ({ heading, description, showQrExample = false, showCallButton = false, callButtonLabel = '복지관에 전화하기' }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const styles = useStyles(emptyWelfareStateStyleFactory);

  return (
    <View style={styles.container}>
      {showQrExample ? (
        <View style={styles.qrExampleCard}>
          <View style={styles.qrExampleSwatch}>
            {QR_EXAMPLE_PATTERN.flat().map((filled, index) => (
              <View key={index} style={styles.qrExampleCell}>
                {Boolean(filled) && <View style={styles.qrExampleCellFill} />}
              </View>
            ))}
          </View>
          <Text style={styles.qrExampleText}>이런 표시를{'\n'}찾으시면 됩니다</Text>
        </View>
      ) : (
        <View style={styles.mark} />
      )}
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('QrScan')}>
          <Text style={styles.primaryButtonText}>QR 찍어서 가입하기</Text>
        </Pressable>
        {showCallButton && (
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{callButtonLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const emptyWelfareStateStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    mark: {
      width: 88,
      height: 5,
      backgroundColor: color.navy,
    },
    heading: {
      fontSize: fontSize('xxxl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xxxl') * 1.45,
      marginTop: 24,
      textAlign: 'center',
      color: semantic.textPrimary,
    },
    description: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.7,
      marginTop: 16,
      textAlign: 'center',
      color: semantic.textMuted,
    },
    qrExampleCard: {
      width: '100%',
      marginTop: 22,
      backgroundColor: color.grey50,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
      padding: 22,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    qrExampleSwatch: {
      width: 104,
      height: 104,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.grey0,
      borderWidth: 2,
      borderColor: color.grey300,
      padding: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    qrExampleCell: {
      width: '25%',
      height: '25%',
      padding: 2,
    },
    qrExampleCellFill: {
      flex: 1,
      backgroundColor: color.grey800,
      borderRadius: 2,
    },
    qrExampleText: {
      flex: 1,
      fontSize: fontSize('md'),
      fontFamily: fontFamily('semibold'),
      lineHeight: fontSize('md') * 1.65,
      color: color.grey700,
    },
    buttonGroup: {
      width: '100%',
      marginTop: 22,
      gap: 12,
    },
    primaryButton: {
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileButton,
      backgroundColor: semantic.ctaBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.ctaFg,
    },
    secondaryButton: {
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileButton,
      backgroundColor: color.grey0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('semibold'),
      color: color.grey800,
    },
  });

export default EmptyWelfareState;
