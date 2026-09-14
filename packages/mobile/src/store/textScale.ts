import AsyncStorage from '@react-native-async-storage/async-storage';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { scale } from '@common/shared';

const storage = createJSONStorage<number>(() => AsyncStorage);

export const textScaleAtom = atomWithStorage<number>(
  'textScale',
  scale.mobile.userScale[0],
  storage,
);
