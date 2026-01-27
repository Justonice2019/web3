import type { NextPage } from 'next';
import Header from '../components/Header';
import Info from '../components/Info';
import NetworkSwitcher from '../components/NetworkSwitcher';

const Home: NextPage = () => {
  return (
      <>
        <Header />
        <Info />
        <NetworkSwitcher />
      </>

  );
};

export default Home;