import {ConnectButton} from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import {useRouter} from 'next/router'

const Header = () => {
  // const router = useRouter()
  // console.log(router)
  return (<div className="header-container">
    <div className="header-left">
      <Link className="header-link" href={'/'}>Home</Link>
      <Link className="header-link" href={'/wagmi'}>Wagmi</Link>
      <Link className="header-link" href={'/ethers'}>Ethers</Link>
      <Link className="header-link" href={'/ethers-hooks'}>Ethers(hooks)</Link>
      <Link className="header-link" href={'/meta-node-stake'}>MetaNode Stake</Link>
    </div>
    <div className="header-right">
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