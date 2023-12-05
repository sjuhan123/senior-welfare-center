import { useToast } from "@chakra-ui/react";
import { END_POINT } from "../constant/endpoint";
import { useBookmarkListContext } from "../contexts/bookmarkContext";
import { WelfareData } from "../types/welfare";
import { getUserToken } from "../utills/persistentStorage";

const useBookmarkList = () => {
  const toast = useToast();
  const { bookmarkList, updateBookmarkList } = useBookmarkListContext();

  const isAlreadyBookmarked = (welfare: WelfareData) => {
    return bookmarkList.some((bookmark) => bookmark._id === welfare._id);
  };

  const addBookmark = (welfare: WelfareData) => {
    updateBookmarkList([...bookmarkList, welfare]);
  };

  const removeBookmark = (welfare: WelfareData) => {
    updateBookmarkList([
      ...bookmarkList.filter((bookmark) => bookmark !== welfare),
    ]);
  };

  const handleBookmark = async (action = "추가", welfare: WelfareData) => {
    if (action === "추가" && bookmarkList.length === 2) {
      toast({
        title: "북마크는 최대 2개까지 가능합니다.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    const token = getUserToken();

    const isBookmarked = isAlreadyBookmarked(welfare);

    if (!token) {
      if (isBookmarked) {
        removeBookmark(welfare);
      } else {
        addBookmark(welfare);
      }
      return;
    }

    try {
      await fetch(
        `${END_POINT.USER_WELFARE_BOOKMARK}?welfareId=${welfare._id}`,
        {
          method: isBookmarked ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (isBookmarked) {
        removeBookmark(welfare);
      } else {
        addBookmark(welfare);
      }
    } catch (error) {
      console.error("Error during bookmark:", error);
    }

    return;
  };

  return { bookmarkList, handleBookmark };
};

export default useBookmarkList;
