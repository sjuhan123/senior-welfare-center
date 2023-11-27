import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import QualificationCheckSection from "../QualificationCheckSection";
import SearchSection from "../SearchSection";
import TabBar from "./TabBar";
import NearByCenterSection from "../NearByCenterSection";
import LocalWelfareSection from "../LocalWelfareSection";

const MenuArea = () => {
  const [isQualificationCheckerClicked, setIsQualificationCheckerClicked] =
    useState(false);
  const [isCenterListClicked, setIsCenterListClicked] = useState(false);

  const handleHomeButtonClick = () => {
    setIsQualificationCheckerClicked(false);
    setIsCenterListClicked(false);
  };

  return (
    <Box as="section">
      <TabBar
        onClick={handleHomeButtonClick}
        isQualificationCheckerClicked={isQualificationCheckerClicked}
        isCenterListClicked={isCenterListClicked}
      />
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={7} colSpan={1}>
          <QualificationCheckSection />
        </GridItem>
        <GridItem rowSpan={7} colSpan={1}>
          <SearchSection />
        </GridItem>
        <GridItem rowSpan={7} colSpan={1}>
          <NearByCenterSection />
        </GridItem>
        <GridItem rowSpan={7} colSpan={1}>
          <LocalWelfareSection />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MenuArea;
