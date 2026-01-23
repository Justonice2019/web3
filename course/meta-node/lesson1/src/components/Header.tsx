import {ConnectButton} from '@rainbow-me/rainbowkit'
import Link from 'next/link'
const Header = () => {
  return (<div className="header-container">
    <Link href={'/'}>Home</Link>
    <Link href={'/ethers'}>Ethers</Link>
    <Link href={'/wagmi'}>Wagmi</Link>
    <ConnectButton
        // label="Sign in"
        // accountStatus="avatar"
        // accountStatus="address"
        // chainStatus="icon"
        // chainStatus="name"
        // chainStatus="none"
        // showBalance={false}
        // accountStatus={{
        //   smallScreen: 'avatar',
        //   largeScreen: 'full',
        // }}
        // showBalance={{
        //   smallScreen: false,
        //   largeScreen: true,
        // }}
    />
  </div>)
}

export default Header