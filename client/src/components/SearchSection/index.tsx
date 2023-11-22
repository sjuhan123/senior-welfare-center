import { Box, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react";

import { CgCloseO } from "react-icons/cg";
import WelfareList from "./WelfareList";
import BreadscrumbList from "./BreadscrumbList";
import DistrictList from "./DistrictList";

interface DistrictListProps {
  onBack: () => void;
}

const SearchSection = ({ onBack }: DistrictListProps) => {
  const [breadCrumbList, setBreadCrumbList] = useState<string[]>(["서울시"]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    null
  );

  const handleBreadCrumbClick = () => {
    setBreadCrumbList(["서울시"]);
    setSelectedDistrictId(null);
  };

  const handleDistrictClick = (districtName: string, districtId: string) => {
    setBreadCrumbList([...breadCrumbList, districtName]);
    setSelectedDistrictId(districtId);
  };

  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="5"
      h="208px"
    >
      <Box mb="2">
        <Flex justify="space-between" align="center">
          <BreadscrumbList
            breadCrumbList={breadCrumbList}
            onBreadCrumbClick={handleBreadCrumbClick}
          />
          <Icon as={CgCloseO} w={4} h={4} onClick={() => onBack()} />
        </Flex>
      </Box>
      <Box overflowY="auto" h="100%">
        {!selectedDistrictId && (
          <DistrictList onDistrictClick={handleDistrictClick} />
        )}
        {selectedDistrictId && <WelfareList districtId={selectedDistrictId} />}
      </Box>
    </Box>
  );
};

export default SearchSection;
