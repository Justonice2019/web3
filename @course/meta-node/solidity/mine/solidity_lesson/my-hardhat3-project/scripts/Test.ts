import hre from 'hardhat'
import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const addresses = require('../ignition/deployments/chain-31337/deployed_addresses.json')

async function main() {
  const {ethers} = await hre.network.connect({
    network: 'localhost',
    chainType: 'l1'
  })
  const accounts = await ethers.getSigners()
  const [a1] = accounts

  const testContract =  await ethers.getContractAt('contracts/Test.sol:Test', addresses['TestModule#Test'], a1)

  const integer = await testContract.integer()
  console.log(`integer: ${integer}`)

  const str = await testContract.str()
  console.log(str)
  const boolean = await testContract.boolean()
  console.log(boolean)
  const addr = await testContract.addr()
  console.log(addr)
}

main()