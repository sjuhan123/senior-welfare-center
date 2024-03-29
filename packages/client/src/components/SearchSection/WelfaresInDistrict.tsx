import { VStack } from "@chakra-ui/react";
import WelfareCards from "../common/Card/WelfareCards";
import useGetWelfaresByDistrictId from "../../hooks/api/welfare/useGetWelfaresByDistrictId";

interface DistrictListProps {
  districtId: string;
}

const WelfaresInDistrict = ({ districtId }: DistrictListProps) => {
  const { data: welfares } = useGetWelfaresByDistrictId(districtId, {
    suspense: true,
  });

  return (
    <VStack spacing={3} align="start">
      {welfares && <WelfareCards welfares={welfares.data} />}
    </VStack>
  );
};

export default WelfaresInDistrict;
