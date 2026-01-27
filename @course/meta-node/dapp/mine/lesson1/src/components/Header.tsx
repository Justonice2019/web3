import {ConnectButton} from '@rainbow-me/rainbowkit'
import Link from 'next/link'

const Header = () => {
  return (<div className="header-container">
    <div className="header-left">
      rainBowKit
    </div>
    <div className="header-right">
      <Link className="header-link" href={'/'}>Home</Link> <br/>
      <Link className="header-link" href={'/wagmi'}>Wagmi</Link><br/>
      <Link className="header-link" href={'/ethers'}>Ethers</Link><br/>
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
    </div>
  </div>)
}

export default Header