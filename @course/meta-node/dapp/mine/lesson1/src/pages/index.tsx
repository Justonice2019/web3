import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
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