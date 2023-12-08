import { useToast } from "@chakra-ui/react";
import { END_POINT } from "../../constant/endpoint";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { WelfareData } from "../../types/welfare";
import {
  addBookmarkAtom,
  bookmarkListAtom,
  isBookmarkedAtom,
  isBookmarkListFullAtom,
  removeBookmarkAtom,
} from "../../store/bookmarkList";
import { isUserTokenValidAtom } from "../../store/auth";
import { del, post } from "../../libs/api";

const useBookmarkList = () => {
  const toast = useToast();
  const bookmarkList = useAtomValue(bookmarkListAtom);
  const isBookmarkListFull = useAtomValue(isBookmarkListFullAtom);
  const isUserTokenValid = useAtomValue(isUserTokenValidAtom);
  const addBookmark = useSetAtom(addBookmarkAtom);
  const removeBookmark = useSetAtom(removeBookmarkAtom);
  const [checkIsWelfareBookmarked] = useAtom(isBookmarkedAtom);

  const handleBookmark = async (action = "추가", welfare: WelfareData) => {
    if (action === "추가" && isBookmarkListFull) {
      toast({
        title: "북마크는 최대 2개까지 가능합니다.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }

    const welfareId = welfare._id;
    const isBookmarked = checkIsWelfareBookmarked(welfareId);

    if (!isUserTokenValid) {
      if (isBookmarked) {
        removeBookmark(welfareId);
      } else {
        addBookmark(welfare);
      }
      return;
    }

    if (isBookmarked) {
      await post(`${END_POINT.USER_WELFARE_BOOKMARK}?welfareId=${welfareId}`);
      removeBookmark(welfareId);
    } else {
      await del(`${END_POINT.USER_WELFARE_BOOKMARK}?welfareId=${welfareId}`);
      addBookmark(welfare);
    }
  };

  return { bookmarkList, handleBookmark };
};

export default useBookmarkList;
