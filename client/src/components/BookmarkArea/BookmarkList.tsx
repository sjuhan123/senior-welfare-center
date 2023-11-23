import { WelfareData } from "../../types/welfare";
import BookmarkableCard from "../common/Card/BookmarkableCard";
import WelfareBookMarkCard from "../common/Card/WelfareBookMarkCard";

interface BookmarkListProps {
  bookmarkList: WelfareData[];
}

const BookmarkList = ({ bookmarkList }: BookmarkListProps) => {
  return (
    <>
      {bookmarkList.length === 0 ? (
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
              onDelete={() => {}}
            />
          ))}
          {bookmarkList.length === 1 && <BookmarkableCard />}
        </>
      )}
    </>
  );
};

export default BookmarkList;
