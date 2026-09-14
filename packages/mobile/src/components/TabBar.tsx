import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { color, semantic, font, hit } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../hooks/styles/useStyles';

const TAB_LABELS: Record<string, string> = {
  Center: '복지관',
  Chat: '대화',
  Feed: '사진방',
  Me: '내 정보',
};

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(tabBarStyleFactory);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tab, { borderTopColor: isFocused ? semantic.actionBg : 'transparent' }]}
          >
            <Text style={[styles.label, { color: isFocused ? semantic.actionBg : semantic.textMuted }]}>{TAB_LABELS[route.name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const tabBarStyleFactory = ({ fontSize }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: color.grey0,
    },
    tab: {
      flex: 1,
      minHeight: hit.mobileNav,
      borderTopWidth: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: fontSize('md'),
      fontWeight: String(font.weight.bold) as '700',
    },
  });

export default TabBar;
