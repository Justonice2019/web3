import {ConnectButton} from '@rainbow-me/rainbowkit'
import Link from 'next/link'
const Header = () => {
  return (<div className="header-container">
    <Link href={'/'}>/</Link> <br/>
    <Link href={'/ethers'}>/ethers</Link><br/>
    <Link href={'/wagmi'}>/wagmi</Link><br/>
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