import Layout from '../components/layout/Layout';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TabBar from '../components/tabBar/TabBar';
import useBreakPointValue from '../hooks/breakPoint/useBreakPointValue';
import BREAKE_POINT from '../hooks/breakPoint/constant';
import SiteInfo from '../components/siteInfo/SiteInfo';
import WelfareList from '../features/welfareList/WelfareList';

const Main = () => {
  const breakPointValue = useBreakPointValue();

  return (
    <Layout>
      <Header title="노인복지관" />
      <WelfareList />
      <Footer>
        {breakPointValue === BREAKE_POINT.MOBILE && <TabBar />}
        {breakPointValue !== BREAKE_POINT.MOBILE && <SiteInfo />}
      </Footer>
    </Layout>
  );
};

export default Main;
