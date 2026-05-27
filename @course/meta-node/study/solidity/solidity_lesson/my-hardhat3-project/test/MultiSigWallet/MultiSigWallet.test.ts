import {expect} from 'chai'
import {network} from 'hardhat'

const {ethers, networkHelpers} = await network.connect({
    chainType: 'l1',
    network: 'localhost',
})

const multiSigWalletFixture = async () => {
    const multiSigWalletFactory = await ethers.getContractFactory('MultiSigWallet')
    const [a1, a2, a3, a4, a5, a6] = await ethers.getSigners()


    const multiSigWallet = await multiSigWalletFactory.deploy([a1, a2, a3], 2)
    return {
        multiSigWallet,
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
        it('提交提案', async () => {

            const {multiSigWallet, a1, a2, a3, a4, a5, a6} = await networkHelpers.loadFixture(multiSigWalletFixture)
            const data = ethers.toUtf8Bytes("")
            const a6addr = await a6.getAddress()
            const value = 100n
            const tx = await multiSigWallet.submitTransaction(a6addr, value, data)
            const receipt = await tx.wait()
            await expect(receipt).emit(multiSigWallet, 'SubmitTransaction').withArgs(0n, a6addr, value, data)

            const result = await multiSigWallet.getTransaction(0n)
            console.log(result)
        })
    })

})