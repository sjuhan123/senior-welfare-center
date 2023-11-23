import { Box, Divider } from "@chakra-ui/react";
import { useState } from "react";

import WelfareList from "./WelfareList";
import BreadscrumbList from "./BreadscrumbList";
import DistrictList from "./DistrictList";

const SearchSection = () => {
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
        <BreadscrumbList
          breadCrumbList={breadCrumbList}
          onBreadCrumbClick={handleBreadCrumbClick}
        />
        <Divider />
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
