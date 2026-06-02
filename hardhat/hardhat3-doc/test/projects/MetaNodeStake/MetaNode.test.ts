import {network, artifacts,} from 'hardhat'
import {expect} from 'chai'
import {Contract, formatEther, parseEther, AbstractSigner, ContractTransactionResponse,type Signer} from "ethers";
import dayjs from 'dayjs'

const {ethers, networkHelpers} = await network.connect({
    network: 'localhost',
    chainType: 'l1'
})

// 前置条件:
// npx hardhat compile (新合约需要先编译一下)
// npx hardhat node (启动本地网络)


// 为了方便测试 我直接沿用测试的环境代理部署脚本的环境来用了
describe('MetaNode', async () => {
    let metaNode: Contract
    let admin: Signer
    let a1: Signer, a2: Signer
    let a1Addr: string, a2Addr: string

    beforeEach(async () => {
        const MetaNodeArtifacts = await artifacts.readArtifact('MetaNode')
        metaNode = await ethers.getContractAt(MetaNodeArtifacts.abi, '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9')

        const signers = await ethers.getSigners()
        admin = signers[0]
        a1 = signers[1]
        a1Addr = await a1.getAddress()

        a2 = signers[2]
        a2Addr = await a2.getAddress()
    })

    it('总供应量', async () => {
        const totalSupply = await metaNode.totalSupply()
        console.log('totalSupply: ', totalSupply)
        console.log('totalSupply: ', ethers.formatUnits(totalSupply, 18), 'MMT', '(formatted)')
    });

    it('转给他人', async () => {
        console.log('admin balance: ', await metaNode.balanceOf(admin))

        const amount = 50000n
        const tx = await metaNode.transfer(a1Addr, amount)
        const receipt = await tx.wait()
        expect(receipt.status === 1).is.true

        console.log('admin balance: ', await metaNode.balanceOf(admin))
        const a1Balance = await metaNode.balanceOf(a1Addr)
        console.log('a1 balance: ', a1Balance)

    });
})
