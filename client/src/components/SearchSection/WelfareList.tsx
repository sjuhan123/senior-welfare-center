// DistrictList.js
import { VStack, Divider } from "@chakra-ui/react";
import { useQuery } from "react-query";
import WelfareCard from "../common/Card/WelfareCard";
import { WelfareData } from "../../types/welfare";
import { Fragment } from "react";

const fetchWelfaresByDistrict = async (districtId: string) => {
  const res = await fetch(
    `http://localhost:8000/api/welfares?districtId=${districtId}`
  );
  return await res.json();
};

interface DistrictListProps {
  districtId: string;
}

const WelfareList = ({ districtId }: DistrictListProps) => {
  const { data } = useQuery(["welfares", districtId], () =>
    fetchWelfaresByDistrict(districtId)
  );

  return (
    <VStack spacing={3} align="start">
      {data?.data.map((welfare: WelfareData) => (
        <Fragment key={welfare._id}>
          <WelfareCard
            center={welfare}
            onBookmark={() => console.log("북마크")}
          />
          <Divider />
        </Fragment>
      ))}
    </VStack>
  );
};

export default WelfareList;
