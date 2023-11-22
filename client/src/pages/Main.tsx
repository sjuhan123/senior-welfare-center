import Layout from "../components/Layout";
import Header from "../components/Header";
import Contents from "../components/Contents";
import Footer from "../components/Footer";
import LoginArea from "../components/LoginArea";
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
        <Contents />
        <LoginArea />
      </Box>
      <Footer />
    </Layout>
  );
};

export default Main;
