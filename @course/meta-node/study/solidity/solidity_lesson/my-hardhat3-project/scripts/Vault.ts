import hre from 'hardhat'
import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const addresses = require('../ignition/deployments/chain-31337/deployed_addresses.json')

async function main() {
  const {ethers} = await hre.network.connect({
    network: 'localhost',
    chainType: 'l1',
  })

  const accounts = await ethers.getSigners()
  const [a1] = accounts
  const vaultContract = await ethers.getContractAt("contracts/Vault.sol:Vault", addresses['VaultModule#Vault'], a1)
  const balance = await vaultContract.getTokenOwnerBalance()
  console.log(`balance: ${balance}`)

  console.log(await ethers.provider.getBalance(a1.address))
}

main()