import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  welfareName: string;
  isStaff: boolean;
  roleLabel: string;
  displayName: string;
  statLabel: string;
  statValue: number;
  sinceLabel: string;
  showSwitchButton: boolean;
  onPressSwitch: () => void;
};

const CenterHeaderCard = ({
  welfareName,
  isStaff,
  roleLabel,
  displayName,
  statLabel,
  statValue,
  sinceLabel,
  showSwitchButton,
  onPressSwitch,
}: Props) => {
  const styles = useStyles(centerHeaderCardStyleFactory);

  return (
    <View style={styles.headerCard}>
      <View style={styles.headerTopRow}>
        <Text style={styles.welfareName}>{welfareName}</Text>
        {isStaff && (
          <View style={styles.staffTag}>
            <Text style={styles.staffTagText}>{roleLabel}</Text>
          </View>
        )}
        {showSwitchButton && (
          <Pressable style={styles.switchButton} onPress={onPressSwitch}>
            <Text style={styles.switchButtonIcon}>⇅</Text>
            <Text style={styles.switchButtonText}>바꾸기</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.badgeRow}>
        <View style={styles.confirmedTag}>
          <Text style={styles.confirmedTagText}>회원 확인됨</Text>
        </View>
        <Text style={styles.roleName}>{displayName}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.statText}>
          {statLabel} <Text style={styles.statValue}>{statValue}개</Text>
        </Text>
        <View style={styles.statDivider} />
        <Text style={styles.statText}>{sinceLabel}</Text>
      </View>
    </View>
  );
};

export default CenterHeaderCard;

const centerHeaderCardStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    headerCard: {
      backgroundColor: semantic.bgSurface,
      paddingHorizontal: 18,
      paddingTop: 20,
      borderBottomWidth: 1,
      borderBottomColor: semantic.border,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    welfareName: {
      flex: 1,
      fontSize: fontSize('xxl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    staffTag: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radius.label,
      backgroundColor: color.navy,
    },
    staffTagText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey0,
    },
    switchButton: {
      flexShrink: 0,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 12,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchButtonIcon: {
      fontSize: fontSize('lg'),
      color: color.grey700,
    },
    switchButtonText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      marginTop: 10,
    },
    confirmedTag: {
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.label,
      backgroundColor: semantic.stateOkBg,
    },
    confirmedTagText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: semantic.stateOkFg,
    },
    roleName: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('semibold'),
      color: color.grey700,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 18,
      marginHorizontal: -18,
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: semantic.divider,
    },
    statText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey700,
    },
    statValue: {
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    statDivider: {
      width: 1,
      height: 14,
      backgroundColor: color.grey300,
    },
  });
