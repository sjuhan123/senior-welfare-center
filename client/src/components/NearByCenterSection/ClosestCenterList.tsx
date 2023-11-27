import { useQuery } from "react-query";
import { Divider } from "@chakra-ui/react";
import { WelfareData } from "../../types/welfare";
import WelfareCard from "../common/Card/WelfareCard";
import useBookmarkList from "../../hooks/useBookmarkList";
import { Fragment } from "react";

async function fetchClosestWelfare(latitude: number, longitude: number) {
  const endpoint = `https://localhost:8000/api/welfares/closest?latitude=${latitude}&longitude=${longitude}`;

  const res = await fetch(endpoint);
  return await res.json();
}

interface ClosestCenterListProps {
  location: {
    latitude: number;
    longitude: number;
  };
  from?: string;
}

const ClosestCenterList = ({
  location,
  from = "me",
}: ClosestCenterListProps) => {
  const { bookmarkList, handleBookmark } = useBookmarkList();
  const { data: welfares, error } = useQuery(
    "closestWelfare",
    () => fetchClosestWelfare(location.latitude, location.longitude),
    {
      enabled: !!location,
      suspense: true,
    }
  );

  return (
    <>
      {error && <div>에러 발생!</div>}
      {welfares?.data.map((welfare: WelfareData) => (
        <Fragment key={welfare._id}>
          <WelfareCard
            center={welfare}
            isBookmarked={
              bookmarkList.some((bookmark) => bookmark._id === welfare._id) ||
              false
            }
            onBookmark={() => handleBookmark(welfare)}
            from={from}
          />
          <Divider />
        </Fragment>
      ))}
    </>
  );
};

export default ClosestCenterList;
