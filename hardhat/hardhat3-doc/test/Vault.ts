import {network} from 'hardhat'
import {expect} from 'chai'
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const addresses = require("../ignition/deployments/chain-31337/deployed_addresses.json");

const {ethers} = await network.connect({
  network: 'localhost',
  chainType: 'l1',
})

describe('Vault', () => {

  let vaultContract: any;

  before(async () => {
    // console.log('before')
    const accounts = await ethers.getSigners();
    const account1 = accounts[0];
    const vaultAddress = addresses['VaultModule#Vault'];
    const tokenAddress = addresses['VaultModule#Token'];
    vaultContract = await ethers.getContractAt("contracts/Vault.sol:Vault", vaultAddress, account1);
  })

  beforeEach(async () => {
    // console.log('beforeEach')
  })

  it('function getVaultBalance() public view returns (uint256)', async () => {
    const vaultBalance = await vaultContract.getVaultBalance()
    // console.log(`vaultBalance: ${vaultBalance}`)
    expect(vaultBalance).to.be.a('bigint')
  });

  it('function deposit(uint256 amount) public', async () => {
    const tx = await vaultContract.deposit(10)
    const receipt = await tx.wait()
    expect(receipt.status).to.equal(1);
    const vaultBalance = await vaultContract.getVaultBalance()
    // console.log(`vaultBalance: ${vaultBalance}`)
    expect(vaultBalance).to.be.a('bigint')
  });

  it('function getTokenOwnerBalance() public view returns (uint256)', async () => {
    const tokenOwnerBalance = await vaultContract.getTokenOwnerBalance()
    // console.log(`tokenOwnerBalance: ${tokenOwnerBalance}`)
    expect(tokenOwnerBalance).to.be.a('bigint')
  });

  it('测试时间旅行', async () => {

  })

})