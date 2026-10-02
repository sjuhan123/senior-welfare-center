import { forwardRef, useCallback, type ComponentRef } from 'react';
import type { LayoutChangeEvent, ScrollViewProps } from 'react-native';
import { KeyboardChatScrollView, type KeyboardChatScrollViewProps } from 'react-native-keyboard-controller';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** compose bar의 기본(한 줄) 높이. 03. V2 개념 학습/08. 키보드 대응 참고. */
export const COMPOSE_BAR_HEIGHT = 116;

/** FlatList가 renderScrollComponent로 사용할, 키보드 높이만큼 콘텐츠 inset을 실시간으로 조정하는 채팅 전용 스크롤뷰 */
const ChatScrollView = forwardRef<ComponentRef<typeof KeyboardChatScrollView>, ScrollViewProps & KeyboardChatScrollViewProps>((props, ref) => (
  <KeyboardChatScrollView ref={ref} inverted automaticallyAdjustContentInsets={false} contentInsetAdjustmentBehavior="never" {...props} />
));
ChatScrollView.displayName = 'ChatScrollView';

/**
 * 메시지 목록(FlatList, inverted) + 하단 고정 compose bar 화면의 키보드 대응.
 * compose bar는 키보드가 열리면 keyboardHeight만큼 위로 이동하고 FlatList 뷰포트 하단은 항상 고정이라,
 * 둘 사이 간격이 정확히 맞으려면 세이프에리어만큼만 보정하면 됨(COMPOSE_BAR_HEIGHT는 양쪽 계산에서 상쇄됨).
 * 03. V2 개념 학습/08. 키보드 대응 참고.
 */
export default function useComposeBarKeyboard() {
  const insets = useSafeAreaInsets();
  const extraContentPadding = useSharedValue(0);

  const renderScrollComponent = useCallback(
    (scrollViewProps: ScrollViewProps) => <ChatScrollView {...scrollViewProps} offset={insets.bottom} extraContentPadding={extraContentPadding} />,
    [extraContentPadding, insets.bottom],
  );

  /** compose bar가 여러 줄로 커질 때, 기본 높이를 넘는 만큼만 스크롤 콘텐츠 inset에 더 반영 */
  const onComposeBarLayout = useCallback(
    (e: LayoutChangeEvent) => {
      extraContentPadding.value = withTiming(Math.max(e.nativeEvent.layout.height - COMPOSE_BAR_HEIGHT, 0), { duration: 250 });
    },
    [extraContentPadding],
  );

  return { insets, renderScrollComponent, onComposeBarLayout };
}
