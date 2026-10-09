import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type LayoutChangeEvent } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { color, semantic, radius, hit } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';

export type SelectedPhoto = { uri: string; contentType: string };

const MAX_PHOTOS = 5;

type Props = {
  canSend: boolean;
  draft: string;
  onChangeDraft: (text: string) => void;
  photos: SelectedPhoto[];
  onChangePhotos: (photos: SelectedPhoto[]) => void;
  onSend: () => void;
  sendDisabled: boolean;
  sendLabel?: string;
  placeholder: string;
  disabledPlaceholder: string;
  nativeID: string;
  offset: { opened: number };
  onLayout: (e: LayoutChangeEvent) => void;
};

const ComposeBar = ({
  canSend,
  draft,
  onChangeDraft,
  photos,
  onChangePhotos,
  onSend,
  sendDisabled,
  sendLabel = '보내기',
  placeholder,
  disabledPlaceholder,
  nativeID,
  offset,
  onLayout,
}: Props) => {
  const styles = useStyles(composeBarStyleFactory);

  const handlePickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS,
      quality: 0.8,
    });
    if (result.canceled) return;

    const picked = result.assets.map(asset => ({ uri: asset.uri, contentType: asset.mimeType ?? 'image/jpeg' }));
    onChangePhotos([...photos, ...picked].slice(0, MAX_PHOTOS));
  };

  const handleRemovePhoto = (uri: string) => {
    onChangePhotos(photos.filter(photo => photo.uri !== uri));
  };

  return (
    <KeyboardStickyView offset={offset} onLayout={onLayout}>
      {canSend ? (
        <View>
          {photos.length > 0 && (
            <ScrollView horizontal style={styles.photoPreviewRow} contentContainerStyle={styles.photoPreviewContent}>
              {photos.map(photo => (
                <View key={photo.uri} style={styles.photoPreviewItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoPreviewImage} />
                  <Pressable style={styles.photoRemoveButton} onPress={() => handleRemovePhoto(photo.uri)}>
                    <Text style={styles.photoRemoveButtonText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.composeBar}>
            <Pressable style={styles.photoButton} onPress={() => void handlePickPhotos()} disabled={photos.length >= MAX_PHOTOS}>
              <Text style={styles.photoButtonText}>사진</Text>
            </Pressable>
            <TextInput
              value={draft}
              onChangeText={onChangeDraft}
              placeholder={placeholder}
              style={styles.composeInput}
              multiline
              nativeID={nativeID}
            />
            <Pressable style={styles.sendButton} onPress={onSend} disabled={sendDisabled}>
              <Text style={styles.sendButtonText}>{sendLabel}</Text>
            </Pressable>
          </View>
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
            <Text style={styles.sendButtonTextDisabled}>{sendLabel}</Text>
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
    photoButton: {
      flexShrink: 0,
      width: hit.mobileLarge,
      minHeight: hit.mobileLarge,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoButtonText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    photoPreviewRow: {
      backgroundColor: semantic.bgSurface,
      borderTopWidth: 1.5,
      borderTopColor: semantic.border,
    },
    photoPreviewContent: {
      gap: 10,
      padding: 12,
    },
    photoPreviewItem: {
      width: 64,
      height: 64,
    },
    photoPreviewImage: {
      width: 64,
      height: 64,
      borderRadius: radius.label,
      backgroundColor: color.grey150,
    },
    photoRemoveButton: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: color.grey700,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoRemoveButtonText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
      lineHeight: fontSize('base'),
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
