import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { radius, hit } from '@common/shared';
import { postMembershipScan } from '../hooks/api/membership/usePostMembershipScan';
import { QUERY_KEYS } from '../constant/queryKeys';
import useStyles from '../hooks/styles/useStyles';
import type { RootStackParamList } from '../router';

const SCAN_BG = '#15171a';
const FRAME_BG = '#232629';
const FRAME_BORDER = '#c8b494';
const BACK_BUTTON_BORDER = '#53575b';

const QrScan = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || status === 'loading') return;

    setScanned(true);
    setStatus('loading');

    try {
      const res = await postMembershipScan(data);
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERSHIPS] });

      navigation.replace('JoinSuccess', {
        welfareName: res.data.welfare.name,
        role: res.data.membership.role,
      });
    } catch (error) {
      console.error('QR 스캔 처리 실패', error);
      setStatus('error');
      setScanned(false);
    }
  };

  const styles = useStyles(({ fontSize, fontFamily }) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: SCAN_BG,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
      },
      backButton: {
        width: 60,
        height: 60,
        borderRadius: radius.mobileContainer,
        borderWidth: 1.5,
        borderColor: BACK_BUTTON_BORDER,
        backgroundColor: FRAME_BG,
        alignItems: 'center',
        justifyContent: 'center',
      },
      backButtonText: {
        fontSize: fontSize('xl'),
        color: '#fff',
      },
      headerTitle: {
        fontSize: fontSize('lg'),
        fontFamily: fontFamily('bold'),
        color: '#fff',
      },
      instruction: {
        fontSize: fontSize('base'),
        fontFamily: fontFamily('semibold'),
        lineHeight: fontSize('base') * 1.6,
        color: '#fff',
        paddingHorizontal: 22,
        paddingBottom: 20,
      },
      frameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
      },
      frame: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: radius.mobileContainer,
        borderWidth: 3,
        borderColor: FRAME_BORDER,
        overflow: 'hidden',
        backgroundColor: FRAME_BG,
      },
      camera: {
        flex: 1,
      },
      permissionText: {
        flex: 1,
        fontSize: fontSize('base'),
        fontFamily: fontFamily('semibold'),
        color: '#fff',
        textAlign: 'center',
      },
      buttonGroup: {
        padding: 22,
        paddingBottom: 28,
        gap: 12,
      },
      primaryButton: {
        minHeight: hit.mobileLarge,
        borderRadius: radius.mobileButton,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      primaryButtonText: {
        fontSize: fontSize('xl'),
        fontFamily: fontFamily('bold'),
        color: '#151719',
      },
      secondaryButton: {
        minHeight: hit.mobileCompact,
        borderWidth: 1.5,
        borderColor: BACK_BUTTON_BORDER,
        borderRadius: radius.mobileButton,
        alignItems: 'center',
        justifyContent: 'center',
      },
      secondaryButtonText: {
        fontSize: fontSize('base'),
        fontFamily: fontFamily('semibold'),
        color: '#fff',
      },
    }),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>QR 찍기</Text>
      </View>
      <Text style={styles.instruction}>종이에 있는 네모난 표시를{'\n'}네모 안에 맞춰 주세요.</Text>
      <View style={styles.frameArea}>
        <View style={styles.frame}>
          {permission?.granted ? (
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
          ) : (
            <View style={[styles.camera, { alignItems: 'center', justifyContent: 'center', padding: 20 }]}>
              <Text style={styles.permissionText}>
                {status === 'error' ? 'QR 처리에 실패했습니다. 다시 시도해 주세요.' : '카메라를 쓰려면 접근을 허용해 주세요.'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonGroup}>
        {!permission?.granted && (
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>카메라 허용하기</Text>
          </Pressable>
        )}
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>어려우면 직원에게 전화</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default QrScan;
