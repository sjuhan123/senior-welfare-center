import BookmarkableCard from "../common/Card/BookmarkableCard";
import WelfareBookMarkCard from "../common/Card/WelfareBookMarkCard";
import useBookmarkList from "../../hooks/useBookmarkList";

const BookmarkList = () => {
  const { bookmarkList, handleBookmark } = useBookmarkList();

  return (
    <>
      {bookmarkList && bookmarkList.length === 0 ? (
        <>
          <BookmarkableCard />
          <BookmarkableCard />
        </>
      ) : (
        <>
          {bookmarkList.map((center) => (
            <WelfareBookMarkCard
              key={center._id}
              center={center}
              onDelete={() => handleBookmark(center)}
            />
          ))}
          {bookmarkList.length === 1 && <BookmarkableCard />}
        </>
      )}
    </>
  );
};

export default BookmarkList;
