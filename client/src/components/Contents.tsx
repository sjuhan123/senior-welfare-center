import { Grid, GridItem } from "@chakra-ui/react";
import NavButton from "./NavButton";
import LoginButton from "../components/LoginButton";

const Contents = () => {
  return (
    <>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={10} colSpan={1}>
          <NavButton fLine="복지관" sLine="자격 확인" />
        </GridItem>
        <GridItem rowSpan={10} colSpan={1}>
          <NavButton fLine="복지관" sLine="목록 보기" />
        </GridItem>
        <GridItem rowSpan={10} colSpan={1}>
          <NavButton fLine="내 근처" sLine="복지관 찾기" />
        </GridItem>
        <GridItem rowSpan={10} colSpan={1}>
          <NavButton fLine="집 근처" sLine="복지관 찾기" />
        </GridItem>
      </Grid>
      <LoginButton />
    </>
  );
};

export default Contents;
