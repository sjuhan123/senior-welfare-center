import Layout from "../components/Layout";
import Header from "../components/Header";
import MenuArea from "../components/MenuArea";
import Footer from "../components/Footer";
import BookmarkArea from "../components/BookmarkArea";
import { Box } from "@chakra-ui/react";

const Main = () => {
  return (
    <Layout>
      <Header />
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
      <Footer />
    </Layout>
  );
};

export default Main;
