import { StyleSheet, Text, View } from 'react-native';
import { color, radius } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  label: string;
  mealText: string;
  dateText: string;
};

const SelectedMealCard = ({ label, mealText, dateText }: Props) => {
  const styles = useStyles(selectedMealCardStyleFactory);

  return (
    <View style={styles.selectedCard}>
      <Text style={styles.selectedLabel}>{label}</Text>
      <Text style={styles.selectedText}>{mealText}</Text>
      <Text style={styles.selectedWhen}>{dateText}</Text>
    </View>
  );
};

export default SelectedMealCard;

const selectedMealCardStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    selectedCard: {
      margin: 14,
      padding: 18,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.brown,
    },
    selectedLabel: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: 'rgba(255,255,255,0.85)',
    },
    selectedText: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xl') * 1.5,
      marginTop: 8,
      color: color.grey0,
    },
    selectedWhen: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 10,
      color: 'rgba(255,255,255,0.85)',
    },
  });
