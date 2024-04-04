import { atom } from 'jotai';
import { WelfareData } from '../types/welfare';

export const bookmarkListAtom = atom<WelfareData[]>([]);

export const addBookmarkAtom = atom(null, (get, set, welfare: WelfareData) => {
  const bookmarkList = get(bookmarkListAtom);
  set(bookmarkListAtom, [...bookmarkList, welfare]);
});

export const removeBookmarkAtom = atom(null, (get, set, welfareId: string) => {
  const bookmarkList = get(bookmarkListAtom);
  set(
    bookmarkListAtom,
    bookmarkList.filter(welfare => welfare._id !== welfareId),
  );
});

export const isBookmarkListFullAtom = atom(get => {
  const bookmarkList = get(bookmarkListAtom);
  return bookmarkList.length === 2;
});

export const isBookmarkedAtom = atom(get => (welfareId: string) => {
  const bookmarkList = get(bookmarkListAtom);
  return bookmarkList.some(welfare => welfare._id === welfareId);
});
