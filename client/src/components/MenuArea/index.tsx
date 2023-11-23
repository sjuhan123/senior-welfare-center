import { Box, Grid, GridItem } from "@chakra-ui/react";
import NavButton from "../common/Button/NavButton";
import { useState } from "react";
import QualificationCheckSection from "../QualificationCheckSection";
import QualificationCheckCard from "../common/Card/QualificationCheckCard";
import SearchSection from "../SearchSection";
import TabBar from "./TabBar";

const MenuArea = () => {
  const [isQualificationCheckerClicked, setIsQualificationCheckerClicked] =
    useState(false);
  const [isQualificationChecked, setIsQualificationChecked] = useState(false);
  const [isCenterListClicked, setIsCenterListClicked] = useState(false);

  const isContentClicked = isQualificationCheckerClicked || isCenterListClicked;

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
      {isQualificationCheckerClicked && (
        <QualificationCheckSection
          onQualificationCheck={(isChecked) =>
            setIsQualificationChecked(isChecked)
          }
          onCancel={() => setIsQualificationCheckerClicked(false)}
        />
      )}
      {isCenterListClicked && <SearchSection />}
      {!isContentClicked && (
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(2, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={7} colSpan={1}>
            {!isQualificationChecked ? (
              <NavButton
                fLine="복지관"
                sLine="자격 확인"
                onClick={() => setIsQualificationCheckerClicked(true)}
              />
            ) : (
              <QualificationCheckCard
                onClick={() => {
                  setIsQualificationChecked(false);
                  setIsQualificationCheckerClicked(true);
                }}
              />
            )}
          </GridItem>
          <GridItem rowSpan={7} colSpan={1}>
            <NavButton
              fLine="복지관"
              sLine="목록 보기"
              onClick={() => setIsCenterListClicked(true)}
            />
          </GridItem>
          <GridItem rowSpan={7} colSpan={1}>
            <NavButton
              fLine="내 근처"
              sLine="복지관 찾기"
              onClick={() => setIsQualificationCheckerClicked(true)}
            />
          </GridItem>
          <GridItem rowSpan={7} colSpan={1}>
            <NavButton
              fLine="집 근처"
              sLine="복지관 찾기"
              onClick={() => setIsQualificationCheckerClicked(true)}
            />
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default MenuArea;
