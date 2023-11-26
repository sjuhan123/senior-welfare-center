// DistrictList.js
import { VStack, Divider } from "@chakra-ui/react";
import { useQuery } from "react-query";
import WelfareCard from "../common/Card/WelfareCard";
import { WelfareData } from "../../types/welfare";
import { Fragment } from "react";
import useBookmarkList from "../../hooks/useBookmarkList";

const fetchWelfaresByDistrict = async (districtId: string) => {
  const res = await fetch(
    `https://localhost:8000/api/welfares?districtId=${districtId}`
  );
  return await res.json();
};

interface DistrictListProps {
  districtId: string;
}

const WelfareList = ({ districtId }: DistrictListProps) => {
  const { bookmarkList, handleBookmark } = useBookmarkList();
  const { data: welfares } = useQuery(
    ["welfares", districtId],
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
            onBookmark={() => handleBookmark(welfare)}
          />
          <Divider />
        </Fragment>
      ))}
    </VStack>
  );
};

export default WelfareList;
