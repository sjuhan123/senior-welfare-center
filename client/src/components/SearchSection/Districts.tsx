import { Text, Button, SimpleGrid } from "@chakra-ui/react";
import { DistrictData } from "../../types/district";
import useGetDistricts from "../../hooks/api/district/useGetDistricts";

interface DistrictListProps {
  onDistrictClick: (districtName: string, districtId: string) => void;
}

const Districts = ({ onDistrictClick }: DistrictListProps) => {
  const { data } = useGetDistricts({
    suspense: true,
  });

  return (
    <SimpleGrid columns={3} spacing={3} bottom="0">
      {data?.data.map((district: DistrictData) => (
        <Button
          key={district._id}
          bg="#7bde94"
          w="100%"
          onClick={() => onDistrictClick(district.name, district._id)}
        >
          <Text fontSize="sm" fontWeight="900">
            {district.name}
          </Text>
        </Button>
      ))}
    </SimpleGrid>
  );
};

export default Districts;
