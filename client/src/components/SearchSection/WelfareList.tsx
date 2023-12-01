// DistrictList.js
import { VStack, Divider } from "@chakra-ui/react";
import { useQuery } from "react-query";
import WelfareCard from "../common/Card/WelfareCard";
import { WelfareData } from "../../types/welfare";
import { Fragment } from "react";
import useBookmarkList from "../../hooks/useBookmarkList";
import { END_POINT } from "../../constant/endpoint";
import { QUERY_KEYS } from "../../constant/queryKeys";

const fetchWelfaresByDistrict = async (districtId: string) => {
  const res = await fetch(`${END_POINT.WELFARES}?districtId=${districtId}`);
  return await res.json();
};

interface DistrictListProps {
  districtId: string;
}

const WelfareList = ({ districtId }: DistrictListProps) => {
  const { bookmarkList, handleBookmark } = useBookmarkList();
  const { data: welfares } = useQuery(
    [QUERY_KEYS.WELFARES, districtId],
    () => fetchWelfaresByDistrict(districtId),
    {
      suspense: true,
    }
  );

  return (
    <VStack spacing={3} align="start">
      {welfares?.data.map((welfare: WelfareData) => (
        <Fragment key={welfare._id}>
          <WelfareCard
            center={welfare}
            isBookmarked={
              bookmarkList.some((bookmark) => bookmark._id === welfare._id) ||
              false
            }
            onBookmark={() => handleBookmark("추가", welfare)}
          />
          <Divider />
        </Fragment>
      ))}
    </VStack>
  );
};

export default WelfareList;
