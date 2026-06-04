import {ethers} from 'ethers'

const MAINNET_WSS_RPC_URL = 'wss://eth-mainnet.g.alchemy.com/v2/cx5un8kKZuKs1pInwGL58'

const provider = new ethers.WebSocketProvider(MAINNET_WSS_RPC_URL);

console.log((await provider.getNetwork()).toJSON())

provider.on('pending', async txHash => {

    const tx = await provider.getTransaction(txHash)

    const inter = new ethers.Interface([
        'function transfer(address, uint) public returns (bool)'
    ])
    const selector = inter.getFunction('transfer').selector
    if (tx !== null && tx.data.indexOf(selector) !== -1) {
        console.log(tx)
        console.log(selector)

        const decoded = inter.parseTransaction({ data: tx.data });
        console.log(decoded)
        console.log(`转账目标地址:${decoded.args[0]}`)
        console.log(`转账金额:${ethers.formatEther(decoded.args[1])}`)
        process.exit(0);  // 0 表示正常退出

    }

})
