import { Fragment } from "react";
import { WelfareData } from "../../../types/welfare";
import WelfareCard from "./WelfareCard";
import useBookmarkList from "../../../hooks/bookmark/useBookmarkList";
import { Divider } from "@chakra-ui/react";

type WelfareCardsProps = {
  welfares: WelfareData[];
  from?: string;
};

const WelfareCards = ({ welfares, from }: WelfareCardsProps) => {
  const { bookmarkList, handleBookmark } = useBookmarkList();
  return welfares.map((welfare: WelfareData) => (
    <Fragment key={welfare._id}>
      <WelfareCard
        center={welfare}
        isBookmarked={
          bookmarkList.some((bookmark) => bookmark._id === welfare._id) || false
        }
        onBookmark={() => handleBookmark("추가", welfare)}
        from={from}
      />
      <Divider />
    </Fragment>
  ));
};

export default WelfareCards;
