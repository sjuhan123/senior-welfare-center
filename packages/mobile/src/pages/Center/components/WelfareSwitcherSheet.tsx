import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import type { MembershipData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';
import { ROLE_LABEL } from '../centerDisplay';
import { formatSince } from '../../../utills/formatSince';

type Props = {
  visible: boolean;
  memberships: MembershipData[];
  activeWelfareId: string;
  onClose: () => void;
  onSwitch: (welfareId: string) => void;
};

const WelfareSwitcherSheet = ({ visible, memberships, activeWelfareId, onClose, onSwitch }: Props) => {
  const styles = useStyles(welfareSwitcherSheetStyleFactory);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>가입한 복지관</Text>
            <Pressable style={styles.sheetCloseButton} onPress={onClose}>
              <Text style={styles.sheetCloseButtonText}>닫기</Text>
            </Pressable>
          </View>
          <ScrollView>
            {memberships.map(m => {
              const isActive = m.welfare._id === activeWelfareId;
              return (
                <Pressable key={m._id} style={[styles.sheetItem, isActive && styles.sheetItemActive]} onPress={() => onSwitch(m.welfare._id)}>
                  <View style={styles.sheetItemTextWrap}>
                    <Text style={styles.sheetItemName}>{m.welfare.name}</Text>
                    <Text style={styles.sheetItemMeta}>
                      {ROLE_LABEL[m.role]} · {formatSince(m.createdAt)}
                    </Text>
                  </View>
                  {isActive && <Text style={styles.sheetItemMark}>선택됨</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default WelfareSwitcherSheet;

const welfareSwitcherSheetStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    sheetBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    sheet: {
      maxHeight: '72%',
      backgroundColor: semantic.bgSurface,
      borderTopWidth: 2,
      borderTopColor: color.navy,
      borderTopLeftRadius: radius.sheet,
      borderTopRightRadius: radius.sheet,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 18,
    },
    sheetTitle: {
      flex: 1,
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sheetCloseButton: {
      minHeight: hit.mobileCompact,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetCloseButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sheetItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginHorizontal: 16,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
      padding: 16,
    },
    sheetItemActive: {
      borderColor: color.navy,
      backgroundColor: color.navySoft,
    },
    sheetItemTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    sheetItemName: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    sheetItemMeta: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 4,
      color: color.grey600,
    },
    sheetItemMark: {
      flexShrink: 0,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
  });
