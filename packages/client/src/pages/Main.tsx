import Layout from '../components/layout/Layout';
import Header from '../components/header/Header';
import MenuArea from '../components/MenuArea';
import BookmarkArea from '../components/BookmarkArea';
import { Box } from '@chakra-ui/react';
import Footer from '../components/footer/Footer';
import TabBar from '../components/tabBar/TabBar';
import useBreakPointValue from '../hooks/breakPoint/useBreakPointValue';
import BREAKE_POINT from '../hooks/breakPoint/constant';
import SiteInfo from '../components/siteInfo/SiteInfo';

const Main = () => {
  const breakPointValue = useBreakPointValue();

  return (
    <Layout>
      <Header title="노인복지관" />
      <Box
        as="main"
        w="100%"
        display="flex"
        flexDir="column"
        gap="30px"
        p="10px 0px"
      >
        <MenuArea />
        <BookmarkArea />
      </Box>
      <Footer>
        {breakPointValue === BREAKE_POINT.MOBILE && <TabBar />}
        {breakPointValue !== BREAKE_POINT.MOBILE && <SiteInfo />}
      </Footer>
    </Layout>
  );
};

export default Main;
