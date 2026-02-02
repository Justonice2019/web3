// const hre = require('hardhat')
// describe("MyToken", async () => {
//     beforeEach(async () => {
//         console.log('等待 2s')
//
//         await new Promise(resolve => {
//             setTimeout(() => {
//                 resolve(1)
//             }, 2000)
//         })
//
//         console.log("开始运行测试用例")
//     })
//
//     it('test1', async () => {
//         console.log('我是 test1')
//     })
//     it('test2', async () => {
//         console.log('我是 test2')
//     })
// })

const hre = require('hardhat')
const {expect} = require('chai')


describe("MyToken Test", async () => {
    const {ethers} = hre

    const initialSupply = 1000000

    let MyTokenContract;

    let account1, account2;

    beforeEach(async () => {
        [account1, account2] = await ethers.getSigners()

        const MyToken = await ethers.getContractFactory("MyToken")
        // MyTokenContract = await MyToken.deploy(initialSupply)
        // MyTokenContract = await MyToken.connect(account1).deploy(initialSupply)
        MyTokenContract = await MyToken.connect(account2).deploy(initialSupply)
        MyTokenContract.waitForDeployment()

        const contractAddress = await MyTokenContract.getAddress();
        expect(contractAddress).to.length.greaterThan(0)

        console.log(contractAddress)
    })
    it('验证合约部署成功', async () => {
        const name = await MyTokenContract.name()
        const symbol = await MyTokenContract.symbol()
        const decimals = await MyTokenContract.decimals()

        expect(name).to.equal("MyToken")
        expect(symbol).to.equal("MTK")
        expect(decimals).to.equal(18)
        console.log(decimals)
    })

    it('验证转账', async () => {
        // const balanceOfAccount1 = await MyTokenContract.balanceOf(account1)
        // expect(balanceOfAccount1).to.equal(initialSupply)

        const resp = await MyTokenContract.transfer(account1, initialSupply / 2)
        console.log(resp)

        const balanceOfAccount2 = await MyTokenContract.balanceOf(account2)

        expect(balanceOfAccount2).to.equal(initialSupply / 2)

    })
    // it('test1', async () => {
    //     console.log('我是 test1')
    // })
    // it('test2', async () => {
    //     console.log('我是 test2')
    // })
})
