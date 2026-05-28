import {ethers} from 'ethers'

describe('ethers6-doc', async () => {
  it('ethers', async () => {
    const {ZeroAddress, ZeroHash} = ethers
    console.log(ZeroAddress) // 0x0000000000000000000000000000000000000000
    console.log(ZeroHash) // 0x0000000000000000000000000000000000000000000000000000000000000000
  })
})