import {expect} from 'chai'
import {network} from 'hardhat'
import * as utils from '../../utils/index.ts'

const {ethers, networkHelpers} = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})

const {provider} = ethers

const multiSigWalletFixture = async () => {
    const multiSigWalletFactory = await ethers.getContractFactory('MultiSigWallet')
    const [a1, a2, a3, a4, a5, a6] = await ethers.getSigners()


    const multiSigWallet = await multiSigWalletFactory.deploy([a1, a2, a3], 2)
    const multiSigWalletAddr = await multiSigWallet.getAddress()
    return {
        multiSigWallet,
        multiSigWalletAddr,
        a1, a2, a3, a4, a5, a6
    }
}

describe('MultiSigWallet', () => {

    describe('部署测试', async () => {

        it('正常部署', async () => {

            const multiSigWalletFactory = await ethers.getContractFactory('MultiSigWallet')
            const [a1, a2, a3] = await ethers.getSigners()

            const multiSigWallet = await multiSigWalletFactory.deploy([a1, a2, a3], 2)
            await multiSigWallet.waitForDeployment()
            console.log(await multiSigWallet.getAddress())

            expect(ethers.isAddress(await multiSigWallet.getAddress())).is.true
        })

        it('非正常部署1', async () => {

            const multiSigWalletFactory = await ethers.getContractFactory('MultiSigWallet')
            const [a1, a2, a3] = await ethers.getSigners()
            await expect(multiSigWalletFactory.deploy([], 2)).to.revertedWith("Owners required")
        })
        it('非正常部署1', async () => {

            const multiSigWalletFactory = await ethers.getContractFactory('MultiSigWallet')
            const [a1, a2, a3] = await ethers.getSigners()
            await expect(multiSigWalletFactory.deploy([a1, a2, a3], 0)).to.revertedWith("Invalid number of required confirmations")
        })

    })

    describe('所有者管理', async () => {

        it('添加所有者', async () => {

            const {multiSigWallet} = await networkHelpers.loadFixture(multiSigWalletFixture)
            const [a1, a2, a3, a4, a5] = await ethers.getSigners()
            const beforeOwnerCount = await multiSigWallet.getOwnerCount()
            const tx = await multiSigWallet.addOwner(a4)
            const receipt = await tx.wait()
            const afterOwnerCount = await multiSigWallet.getOwnerCount()

            expect(receipt?.status === 1 && beforeOwnerCount + 1n === afterOwnerCount).is.true

        })
        it('移除所有者', async () => {

            const {multiSigWallet, a1, a2, a3, a4, a5} = await networkHelpers.loadFixture(multiSigWalletFixture)
            const beforeOwnerCount = await multiSigWallet.getOwnerCount()
            const tx = await multiSigWallet.removeOwner(await a2.getAddress())
            const receipt = await tx.wait()
            const afterOwnerCount = await multiSigWallet.getOwnerCount()

            expect(receipt?.status === 1 && beforeOwnerCount - 1n === afterOwnerCount).is.true

        })
        it('调整阈值', async () => {

            const {multiSigWallet} = await networkHelpers.loadFixture(multiSigWalletFixture)
            const beforeNumConfirmationsRequired = await multiSigWallet.numConfirmationsRequired()
            console.log(beforeNumConfirmationsRequired - 1n)

            const tx = await multiSigWallet.changeThreshold(beforeNumConfirmationsRequired - 1n)
            const receipt = await tx.wait()
            const afterNumConfirmationsRequired = await multiSigWallet.numConfirmationsRequired()

            expect(receipt?.status === 1 && beforeNumConfirmationsRequired - 1n === afterNumConfirmationsRequired).is.true

        })

    })

    describe('提案管理', async () => {

        it('提交提案 获取提案', async () => {

            const {multiSigWallet, a1, a2, a3, a4, a5, a6} = await networkHelpers.loadFixture(multiSigWalletFixture)
            const data = utils.toBytes('')

            const a6addr = await a6.getAddress()
            const value = 100n
            const tx = await multiSigWallet.submitTransaction(a6addr, value, data)
            const receipt = await tx.wait()
            await expect(receipt).emit(multiSigWallet, 'SubmitTransaction').withArgs(0n, a6addr, value, data)

            const result = await multiSigWallet.getTransaction(0n)
            console.log(result)

            expect(result[0] === a6addr).is.true
            expect(result[1] === value).is.true
            expect(result[2] === data).is.true
            expect(result[3] === false).is.true
            expect(result[4] === 0n).is.true
        })

        it('确认提案-撤销确认-执行提案', async () => {

            const {multiSigWallet, multiSigWalletAddr, a1, a2, a3, a4, a5, a6} = await networkHelpers.loadFixture(multiSigWalletFixture)
            const data = utils.toBytes('')

            const a4addr = await a4.getAddress()
            const value = 100n
            const tx = await multiSigWallet.submitTransaction(a4addr, value, data)
            const receipt = await tx.wait()
            await expect(receipt).emit(multiSigWallet, 'SubmitTransaction').withArgs(0n, a4addr, value, data)

            const result = await multiSigWallet.getTransaction(0n)
            console.log(result)

            expect(result[0] === a4addr).is.true
            expect(result[1] === value).is.true
            expect(result[2] === data).is.true
            expect(result[3] === false).is.true
            expect(result[4] === 0n).is.true

            // 确认提案
            const tx2 = await multiSigWallet.connect(a1).confirmTransaction(0n)
            const receipt2 = await tx2.wait()
            expect(receipt2?.status == 1).is.true

            const tx3 = await multiSigWallet.connect(a2).confirmTransaction(0n)
            const receipt3 = await tx3.wait()
            expect(receipt3?.status == 1).is.true

            const result2 = await multiSigWallet.getTransaction(0n)
            console.log(result2)

            expect(result2[4] == 2n).is.true

            // 撤销确认
            // const tx4 = await multiSigWallet.revokeConfirmation(0n)
            // const receipt4 = await tx4.wait()
            // expect(receipt4?.status == 1).is.true
            // const result3 = await multiSigWallet.getTransaction(0n)
            // expect(result3[4] == 1n).is.true

            // await multiSigWallet
            const tr = await a1.sendTransaction({
                to: multiSigWalletAddr,
                value: ethers.parseEther('1')
            })
            await tr.wait()
            console.log(await provider.getBalance(multiSigWalletAddr))

            const tx5 = await multiSigWallet.executeTransaction(0n)
            const receipt5 = await tx5.wait()
            expect(receipt5?.status == 1).is.true

        })
    })

})