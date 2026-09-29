import { Pressable, StyleSheet, Text, TextInput, View, type LayoutChangeEvent } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { color, semantic, radius, hit } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';

type Props = {
  canSend: boolean;
  draft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
  sendDisabled: boolean;
  placeholder: string;
  disabledPlaceholder: string;
  nativeID: string;
  offset: { opened: number };
  onLayout: (e: LayoutChangeEvent) => void;
};

const ComposeBar = ({ canSend, draft, onChangeDraft, onSend, sendDisabled, placeholder, disabledPlaceholder, nativeID, offset, onLayout }: Props) => {
  const styles = useStyles(composeBarStyleFactory);

  return (
    <KeyboardStickyView offset={offset} onLayout={onLayout}>
      {canSend ? (
        <View style={styles.composeBar}>
          <TextInput value={draft} onChangeText={onChangeDraft} placeholder={placeholder} style={styles.composeInput} multiline nativeID={nativeID} />
          <Pressable style={styles.sendButton} onPress={onSend} disabled={sendDisabled}>
            <Text style={styles.sendButtonText}>보내기</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.composeBar}>
          <TextInput
            value=""
            editable={false}
            placeholder={disabledPlaceholder}
            style={[styles.composeInput, styles.composeInputDisabled]}
            multiline
          />
          <View style={[styles.sendButton, styles.sendButtonDisabled]}>
            <Text style={styles.sendButtonTextDisabled}>보내기</Text>
          </View>
        </View>
      )}
    </KeyboardStickyView>
  );
};

export default ComposeBar;

const composeBarStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    composeBar: {
      flexDirection: 'row',
      gap: 10,
      padding: 12,
      backgroundColor: semantic.bgSurface,
      borderTopWidth: 1.5,
      borderTopColor: semantic.border,
    },
    composeInput: {
      flex: 1,
      minHeight: hit.mobileLarge,
      maxHeight: 120,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      backgroundColor: semantic.bgSurface,
      fontFamily: fontFamily('regular'),
      fontSize: fontSize('lg'),
      color: semantic.textPrimary,
    },
    composeInputDisabled: {
      backgroundColor: color.grey50,
      borderColor: color.grey300,
      color: color.grey500,
    },
    sendButton: {
      flexShrink: 0,
      minWidth: 90,
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.navy,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: color.grey150,
    },
    sendButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    sendButtonTextDisabled: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey500,
    },
  });
