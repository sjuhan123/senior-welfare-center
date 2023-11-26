import { Text, Button, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { DistrictData } from "../../types/district";

const fetchDistricts = async () => {
  const res = await fetch("https://localhost:8000/api/districts");
  return await res.json();
};

interface DistrictListProps {
  onDistrictClick: (districtName: string, districtId: string) => void;
}

const DistrictList = ({ onDistrictClick }: DistrictListProps) => {
  const { data } = useQuery("districts", fetchDistricts, {
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

export default DistrictList;
