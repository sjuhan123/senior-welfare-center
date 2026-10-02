import { atom } from 'jotai';
import { UserKakaoInfo } from '../types/user';

export const userInfoAtom = atom<UserKakaoInfo>({
  userName: '',
  userAvatar: '',
  customAvatar: '',
});

export const resetUserInfoAtom = atom(null, (_get, set) => {
  set(userInfoAtom, {
    userName: '',
    userAvatar: '',
    customAvatar: '',
  });
});
