import {ethers} from 'ethers'

const SEPOLIA_HTTPS_RPC_URL = 'https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981'
const SEPOLIA_WSS_RPC_URL = 'wss://sepolia.infura.io/ws/v3/e13648d8a1f64b839a17533b1bd2d981'

describe('ethers6-doc', async () => {
    it('ethers', async () => {
        const {ZeroAddress, ZeroHash} = ethers
        console.log(ZeroAddress) // 0x0000000000000000000000000000000000000000
        console.log(ZeroHash) // 0x0000000000000000000000000000000000000000000000000000000000000000
    })

    describe('钱包', () => {

        it('用助记词获取钱包', async () => {
            const phrase = 'meadow author physical lazy filter goose hospital coast cloud public peace title'
            const wallet = ethers.Wallet.fromPhrase(phrase)
            console.log(await wallet.getAddress()) // 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885
            console.log()
            // TODO: 无
            const account0 = ethers.HDNodeWallet.fromPhrase(phrase, "m/44'/60'/0'/0/0");
            const account1 = ethers.HDNodeWallet.fromPhrase(phrase, "m/44'/60'/0'/0/1");
            const account2 = ethers.HDNodeWallet.fromPhrase(phrase, "m/44'/60'/0'/0/2");
            console.log(account0.address)
            console.log(account1.address)
            console.log(account2.address)
            // 账户1: 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885
            // 账户2: 0x3Ad104903f7d1b80CC970486D51Aa28C156a83E2
            // 账户3: 0x0b5D4eb5c8C2C25FA5cA0E4534f5F6E2D48EE9c3

            // 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885 // 这个是 我在sepolia网络上面的地址 我一共带这个一起有3个账户的 下面的三个地址不对
            // 0x07c32fE884DD28cc00eEB5637D9AE8aeec18db02
            // 0xe69A81e5D24ADFD36E9D50b17E7dFa054669C02e
            // 0x6C3305DDE850bAC20d6b3c1b9C98444d837e733A
        })
    })
})
