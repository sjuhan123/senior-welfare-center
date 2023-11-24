import { useBookmarkListContext } from "../contexts/bookmarkContext";
import { WelfareData } from "../types/welfare";
import { getUserToken } from "../utills/persistentStorage";

const useBookmarkList = () => {
  const { bookmarkList, updateBookmarkList } = useBookmarkListContext();

  const isAlreadyBookmarked = (welfare: WelfareData) => {
    return bookmarkList.some((bookmark) => bookmark._id === welfare._id);
  };

  const addBookmark = (welfare: WelfareData) => {
    updateBookmarkList([...bookmarkList, welfare]);
  };

  const removeBookmark = (welfare: WelfareData) => {
    updateBookmarkList(bookmarkList.filter((bookmark) => bookmark !== welfare));
  };

  const handleBookmark = async (welfare: WelfareData) => {
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
        `https://localhost:8000/api/user/welfare?welfareId=${welfare._id}`,
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
