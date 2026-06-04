import {ethers} from 'ethers'
import {expect} from 'chai'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)

const EXAMPLE_ARTIFACT = require('./artifacts/Example.json')
const EXAMPLE_SEPOLIA_ADDR = '0x99bb391a6fa6Cb8cb0941f986373869129E58d11'

const META_NODE_ARTIFACT = require('./artifacts/MetaNode.json')
const META_NODE_SEPOLIA_ADDR = '0x1Be8D5E3f04e79aBae5918209Bd582d348Dd8E07'

const SEPOLIA_HTTPS_RPC_URL = 'https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981'
const SEPOLIA_WSS_RPC_URL = 'wss://sepolia.infura.io/ws/v3/e13648d8a1f64b839a17533b1bd2d981'

const MAINNET_HTTPS_RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/cx5un8kKZuKs1pInwGL58'
const MAINNET_WSS_RPC_URL = 'wss://eth-mainnet.g.alchemy.com/v2/cx5un8kKZuKs1pInwGL58'

const WALLET1_ADDR = '0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885'
const WALLET2_ADDR = '0x3Ad104903f7d1b80CC970486D51Aa28C156a83E2'

const PRIVATE_KEY_1 = '925eddbd83b71706148ba1799ce40eca3ea9d581e848ca87f01a0f46ae6b98df'
const PRIVATE_KEY_2 = '7280d64476c76cf80d772bf120e8c3d7bddb3077258291661c0159c029676405'

describe('meta-node-ethers6-doc', async () => {

    describe('01.ethers.js简述', () => {

        it('默认公共提供商', async () => {
            const provider = await ethers.getDefaultProvider()
            const balance = await provider.getBalance('vitalik.eth')
            // 有可能失败的 和 电脑的网络有关系
            console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`) // ETH Balance of vitalik: 5.680090061791218057 ETH
        })

        it('使用自定义节点提供商', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL)

            const balance = await provider.getBalance('vitalik.eth')

            console.log(`${ethers.formatEther(balance)} ETH`)
        })

    })

    describe('02.Provider 提供器', () => {

        it('02.Provider 提供器', async () => {

            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL)

            const wallet = new ethers.Wallet(PRIVATE_KEY_1, provider)

            const balance = await provider.getBalance(await wallet.getAddress())

            console.log(`${ethers.formatEther(balance)} ETH`)

            console.log((await provider.getNetwork()).toJSON()) // { name: 'sepolia', chainId: '11155111' }

            console.log(await provider.getBlockNumber());

            console.log(await provider.getTransactionCount('vitalik.eth'))

            console.log(await provider.getTransactionCount(await wallet.getAddress()))

            console.log(await provider.getFeeData())

            console.log(await provider.getBlock(10980403))
            console.log(await provider.getBlock(10980404))

            console.log(await provider.getCode('0x99bb391a6fa6Cb8cb0941f986373869129E58d11'))
        })
    })

    describe('03.读取合约信息', () => {

        it('03.读取合约信息', async () => {

            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL)

            const wallet = new ethers.Wallet(PRIVATE_KEY_1, provider)

            const exampleContract = new ethers.Contract(EXAMPLE_SEPOLIA_ADDR, EXAMPLE_ARTIFACT.abi, wallet)
            console.log(await exampleContract.count())
            console.log(await exampleContract.getCount())
            await (await exampleContract.addCount()).wait()
            await (await exampleContract['addCount(uint256)'](2n)).wait()
            console.log(await exampleContract.count())

        })
    })

    describe('04.发送ETH', () => {

        it('助记词获取钱包实例(随机钱包测试)', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL);
            const walletRandom = ethers.Wallet.createRandom()
            console.log(walletRandom)
            const walletRandomWithProvider = walletRandom.connect(provider)
            console.log(walletRandomWithProvider)

            const walletRandomAddr = await walletRandom.getAddress()
            const walletRandomWithProviderAddr = await walletRandomWithProvider.getAddress()
            console.log(walletRandomAddr)
            console.log(walletRandomWithProviderAddr)
            expect(walletRandomAddr === walletRandomWithProviderAddr).is.true


            const phrase = walletRandom.mnemonic?.phrase
            console.log(phrase)
            console.log(walletRandomWithProvider.mnemonic?.phrase)

            if (phrase) {
                const walletPhrase = ethers.Wallet.fromPhrase(phrase);
                const walletPhraseAddr = await walletPhrase.getAddress()
                const walletPhraseWithProviderAddr = await walletPhrase.connect(provider).getAddress()
                console.log(walletPhraseAddr)
                console.log(walletPhraseWithProviderAddr)
                expect(walletRandomAddr === walletPhraseAddr).is.true
                expect(walletRandomWithProviderAddr === walletPhraseWithProviderAddr).is.true
            }
        })
        it('助记词获取钱包实例(个人账户)', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL);
            const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const wallet1Addr = await wallet1.getAddress()
            console.log(wallet1Addr)

            const phrase = 'meadow author physical lazy filter goose hospital coast cloud public peace title'
            const wallet2 = ethers.Wallet.fromPhrase(phrase)
            const wallet2Addr = await wallet2.getAddress()
            console.log(wallet2Addr)

            const wallet2WithProvider = wallet2.connect(provider)
            const wallet2WithProviderAddr = await wallet2WithProvider.getAddress()
            console.log(wallet2WithProviderAddr)

            expect(wallet1Addr === wallet2Addr && wallet2Addr === wallet2WithProviderAddr).is.true
        })

        it('04.发送ETH', async () => {
            console.log(ethers.Wallet.createRandom())

            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL)

            const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const wallet2 = new ethers.Wallet(PRIVATE_KEY_2, provider)

            console.log(await provider.getBalance(wallet1))
            console.log(await provider.getBalance(wallet2))
            const tx = await wallet1.sendTransaction({
                to: wallet2,
                value: 100n,
            })
            const receipt = await tx.wait()
            expect(receipt?.status === 1).is.true

            console.log(await provider.getBalance(wallet1));
            console.log(await provider.getBalance(wallet2))

        })
    })

    describe('07.检索事件', async () => {

        it('07.检索事件', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL);
            const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const exampleContract = new ethers.Contract(EXAMPLE_SEPOLIA_ADDR, EXAMPLE_ARTIFACT.abi, wallet1)
            const result = await exampleContract.queryFilter('Increment', 0, 'latest')
            console.log(result)
        })
    })

    describe('08.监听合约事件', async () => {

        it('08.监听合约事件', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL);
            const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const exampleContract = new ethers.Contract(EXAMPLE_SEPOLIA_ADDR, EXAMPLE_ARTIFACT.abi, wallet1)

            exampleContract.on('Increment', (...args) => {
                console.log(args)
            })

            console.log(await exampleContract.count())
            const tx = await exampleContract['addCount(uint256)'](2n)
            const receipt = await tx.wait()

            expect(receipt?.status === 1).is.true
            console.log(await exampleContract.count())
        })
    })

    describe('09.事件过滤', async () => {

        it('09.事件过滤', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL);
            const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const metaNodeContract = new ethers.Contract(META_NODE_SEPOLIA_ADDR, META_NODE_ARTIFACT.abi, wallet1)

            const filter1 = metaNodeContract.filters.Transfer(wallet1)
            metaNodeContract.on(filter1, (...args) => {
                console.log(args)
            })

            const filter2 = metaNodeContract.filters.Transfer(null, null, 100n)
            metaNodeContract.on(filter2, (...args) => {
                console.log(args) // 因为 uint256 value 没有 indexed修饰, 是无法被过滤出来的
            })

            console.log(await metaNodeContract.balanceOf(WALLET2_ADDR))
            await (await metaNodeContract.transfer(WALLET2_ADDR, 100)).wait()
            console.log(await metaNodeContract.balanceOf(WALLET2_ADDR))
        })

    })

    describe('10.BigInt和单位转换', async () => {

        it('BigInt', async () => {
            console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991
            console.log(ethers.getBigInt('9007199254740991'))
            console.log(ethers.getBigInt(9007199254740991))

            console.log((255).toString(16)) // ff
            console.log(255..toString(16)) //ff

            console.log(`0x${9007199254740991..toString(16)}`) // 0x1fffffffffffff
            console.log(ethers.getBigInt(0x1fffffffffffff)) // 9007199254740991n
        })

        it('单位转换', async () => {
            const oneGWei = 1000000000
            console.log(typeof ethers.formatUnits(oneGWei, 9), 'ETH') // 1.0 ETH
            console.log(ethers.formatUnits(oneGWei, 'gwei'), 'ETH') // 1.0 ETH
        })

    })

    describe('11.StaticCall', async () => {

        it('StaticCall(老师的案例)', async () => {
            const provider = new ethers.JsonRpcProvider(MAINNET_HTTPS_RPC_URL);
            const privateKey = '0f03a73988c990c2333bbbcd99d442377fedbe48083a8a9c4426ace223c33e5d'

            const wallet = new ethers.Wallet(privateKey, provider)

            // DAI的ABI
            const abiDAI = [
                "function balanceOf(address) public view returns(uint)",
                "function transfer(address, uint) public returns (bool)",
            ];
            // DAI合约地址（主网）
            const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

            // 创建DAI合约实例
            const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

            const main = async () => {
                try {
                    const address = await wallet.getAddress()
                    // 1. 读取DAI合约的链上信息
                    console.log("\n1. 读取测试钱包的DAI余额")
                    const balanceDAI = await contractDAI.balanceOf(address)
                    const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")

                    console.log(`测试钱包 DAI持仓: ${ethers.formatEther(balanceDAI)}\n`)
                    console.log(`vitalik DAI持仓: ${ethers.formatEther(balanceDAIVitalik)}\n`)

                    // 2. 用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik，交易将成功
                    console.log("\n2.  用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik地址")
                    // 发起交易
                    const tx = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("1"), {from: await provider.resolveName("vitalik.eth")})
                    console.log(`交易会成功吗？：`, tx)

                    // 3. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
                    console.log("\n3.  用staticCall尝试调用transfer转账1 DAI，msg.sender为测试钱包地址")
                    const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
                    console.log(`交易会成功吗？：`, tx2)

                } catch (e) {
                    console.log(e);
                }
            }
            await main()
        })

        it('StaticCall(自己的案例)', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL)
            const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)

            const metaNodeContract = new ethers.Contract(META_NODE_SEPOLIA_ADDR, META_NODE_ARTIFACT.abi, wallet1)
            const balance = await metaNodeContract.balanceOf(await wallet1.getAddress())

            const tx1 = await metaNodeContract.transfer.staticCall(WALLET2_ADDR, balance, {
                from: await wallet1.getAddress() // 可选
            })
            console.log(tx1)
            const tx2 = await metaNodeContract.transfer.staticCall(WALLET2_ADDR, balance + 1n, {
                from: await wallet1.getAddress() // 可选
            })
            console.log(tx2)
        })

    })

    describe('12.识别ERC721合约', async () => {

        it('老师的例子', async () => {
            const provider = new ethers.JsonRpcProvider(MAINNET_HTTPS_RPC_URL);

            // 合约abi
            const abiERC721 = [
                "function name() view returns (string)",
                "function symbol() view returns (string)",
                "function supportsInterface(bytes4) public view returns(bool)",
            ];
            // ERC721的合约地址，这里用的BAYC
            const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
            // 创建ERC721合约实例
            const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider)

            // ERC721接口的ERC165 identifier
            const selectorERC721 = "0x80ac58cd"
            const main = async () => {
                try {
                    // 1. 读取ERC721合约的链上信息
                    const nameERC721 = await contractERC721.name()
                    const symbolERC721 = await contractERC721.symbol()
                    console.log("\n1. 读取ERC721合约信息")
                    console.log(`合约地址: ${addressBAYC}`)
                    console.log(`名称: ${nameERC721}`)
                    console.log(`代号: ${symbolERC721}`)

                    // 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
                    const isERC721 = await contractERC721.supportsInterface(selectorERC721)
                    console.log("\n2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准")
                    console.log(`合约是否为ERC721标准: ${isERC721}`)
                } catch (e) {
                    // 如果不是ERC721，则会报错
                    console.log(e);
                }
            }

            await main()
        })

    })

    describe('13.编码calldata', () => {

        it('13.编码calldata', async () => {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL);
            const wallet = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const walletAddr = await wallet.getAddress()
            const metaNodeAbi = [
                "function balanceOf(address) public view returns(uint)",
                "function deposit() public payable",
            ];
            // 方式1:
            // const metaNodeContract = new ethers.Contract(META_NODE_SEPOLIA_ADDR, metaNodeAbi, wallet);
            // console.log(await metaNodeContract.balanceOf(walletAddr))
            // const encodedData = metaNodeContract.interface.encodeFunctionData(
            //     'balanceOf',
            //     [walletAddr]
            // )
            // 方式2:
            const inter = new ethers.Interface([
                'function balanceOf(address) public view returns(uint)',
                // 'function   balanceOf(address)',
            ])
            const encodedData = inter.encodeFunctionData(
                'balanceOf',
                [walletAddr]
            )

            console.log(encodedData)
            const balance = await provider.call({
                to: META_NODE_SEPOLIA_ADDR,
                data: encodedData
            })
            console.log(ethers.getBigInt(balance))
        })
    })

    describe('14.批量生成钱包', () => {
        it('14.批量生成钱包', async () => {
            // 1. 创建HD钱包 (ethers V6)
            console.log("\n1. 创建HD钱包");
            // 生成随机助记词
            const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));
            // 创建HD基钱包
            const basePath = "44'/60'/0'/0";
            const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath);
            console.log(baseWallet);

            // 2. 通过HD钱包派生20个钱包
            console.log("\n2. 通过HD钱包派生20个钱包");
            const numWallet = 20;
            let wallets = [];
            for (let i = 0; i < numWallet; i++) {
                let baseWalletNew = baseWallet.derivePath(i.toString());
                console.log(`第${i + 1}个钱包地址： ${baseWalletNew.address}`);
                wallets.push(baseWalletNew);
            }

            // 3. 保存钱包（加密json）
            console.log("\n3. 保存钱包（加密json）");
            const wallet = ethers.Wallet.fromPhrase(mnemonic);
            console.log("通过助记词创建钱包：");
            console.log(wallet);
            const pwd = "RCC";  // 加密json用的密码，可以更改成别的
            const json = await wallet.encrypt(pwd);
            console.log("钱包的加密json：");
            console.log(json);

            // 4. 从加密json读取钱包
            const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
            console.log("\n4. 从加密json读取钱包：");
            console.log(wallet2);
        })
    })

    describe('17.监听Mempool', () => {


        it('17.监听Mempool',  () => {
            // 不能在 mocha环境做监听, 必须用node直接运行逻辑
        })
    })

    describe('20.读取任意数据', async () => {
        it('20.读取任意数据', async () => {
            const provider = new ethers.JsonRpcProvider(MAINNET_HTTPS_RPC_URL)
            const wallet = new ethers.Wallet(PRIVATE_KEY_1, provider)
            const addressBridge = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a' // DAI Contract
            // 合约所有者 slot
            const slot = `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`
            const privateData  = await provider.getStorage(addressBridge, slot)
            console.log(ethers.getAddress(ethers.dataSlice(privateData, 12))) // 0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD

        })
    })

})
