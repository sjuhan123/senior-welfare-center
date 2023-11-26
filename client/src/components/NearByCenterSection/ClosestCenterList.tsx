import { useQuery } from "react-query";
import { Divider, Flex, Spinner } from "@chakra-ui/react";
import { WelfareData } from "../../types/welfare";
import { Fragment } from "react";
import WelfareCard from "../common/Card/WelfareCard";
import useBookmarkList from "../../hooks/useBookmarkList";

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
}

const ClosestCenterList = ({ location }: ClosestCenterListProps) => {
  const { bookmarkList, handleBookmark } = useBookmarkList();
  const {
    data: welfares,
    error,
    isLoading,
  } = useQuery(
    "closestWelfare",
    () => fetchClosestWelfare(location.latitude, location.longitude),
    {
      enabled: !!location,
    }
  );

  return (
    <>
      {isLoading && (
        <Flex
          align="center"
          justify="center"
          height="100%"
          width="100%"
          position="fixed"
          top="0"
          left="0"
        >
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}
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
          />
          <Divider />
        </Fragment>
      ))}
    </>
  );
};

export default ClosestCenterList;
