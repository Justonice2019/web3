import {expect} from 'chai'
import {ethers} from 'ethers'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)

const exampleArtifact = require('./Example.json')

// 个人账户
const addressAccount = '0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885'

// 私钥 (0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885 的私钥, 危险不可暴露出去)
const PRIVATE_KEY = '925eddbd83b71706148ba1799ce40eca3ea9d581e848ca87f01a0f46ae6b98df'

// 交易hash (咸鱼购买的 sepolia 的 5 ETH)
const txHash = '0x6448d5b7553fbd0c55159503187d3a735444df18ff1c8ac0a05a0878bb33e59e'

// Example合约地址 (使用 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885 在 sepolia 发布的合约
const exampleContractAddress = '0x99bb391a6fa6Cb8cb0941f986373869129E58d11'

// 提供商
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981')

// 钱包
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

describe('ethers-demo', () => {

  describe('3. Provider连接详解', async () => {
    it('3.3 连接测试网和主网', async () => {
      const provider1 = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981')
      console.log(await provider1.getBlockNumber())

      const provider2 = new ethers.InfuraProvider('sepolia', 'e13648d8a1f64b839a17533b1bd2d981')
      console.log(await provider2.getBlockNumber())
    })
    it('3.4 验证连接', async () => {
      const network = await provider.getNetwork();
      console.table([
        {
          'getBlockNumber()': await provider.getBlockNumber(),
          'network.name': network.name,
          'network.chainId': network.chainId,
        }
      ])
    })
  })

  describe('4. 读取区块链数据', async () => {
    it('4.1 区块信息查询', async () => {
      const block = await provider.getBlock('latest', true);
      if (block) {
        console.table([
          {
            'block.hash': block.hash,
            'block.number': block.number,
            'block.timestamp': new Date(block.timestamp * 1000),
            'block.transactions.length': block.transactions.length,
            'block.prefetchedTransactions.length': block.prefetchedTransactions.length, // getBlock(..., true) 为true 才有这个属性
          }
        ]);
      }

      // const blockSpecify = await provider.getBlock(100);
      // if (blockSpecify) {
      //   console.table([
      //     {
      //       'block.hash': blockSpecify.hash,
      //       'block.number': blockSpecify.number,
      //       'block.timestamp': new Date(blockSpecify.timestamp * 1000),
      //       'block.transactions.length': blockSpecify.transactions.length,
      //       'block.prefetchedTransactions.length': blockSpecify.prefetchedTransactions.length,
      //     }
      //   ]);
      // }
    })

    it('4.2 账户信息查询', async () => {
      const balance = await provider.getBalance(addressAccount)
      console.table([
        {
          'getBalance()': balance,
          'getBalance() formatEther()': `${ethers.formatEther(balance)}ETH`,
          'getTransactionCount()': await provider.getTransactionCount(addressAccount),
          'getCode() 普通账户': await provider.getCode(addressAccount),
          'getCode() 合约账户': `${(await provider.getCode(exampleContractAddress)).slice(0, 8)}`,
        }
      ])
    })

    it('4.3 交易信息查询', async () => {
      const tx = await provider.getTransaction(txHash)
      console.log('provider.getTransaction(txHash)')
      if (tx) {
        console.table([
          {
            'from': tx.from,
            'to': tx.to,
            'value': tx.value,
            'value: 格式化': `${ethers.formatEther(tx.value)}ETH`,
            'gasLimit': tx.gasLimit,
            'gasPrice': tx.gasPrice,
          }
        ]);
      }

      const receipt = await provider.getTransactionReceipt(txHash)
      if (receipt) {
        console.log('provider.getTransactionReceipt(txHash)')
        console.table([
          {
            'status': receipt.status === 1 ? '成功' : '失败',
            'blockNumber': receipt.blockNumber,
            'gasUsed': receipt.gasUsed,
            'logs.length': receipt.logs.length,
          }
        ]);
      }
    })

    it('4.4 存储信息查询', async () => {
      console.table([
        {
          'getStorage()': await provider.getStorage(exampleContractAddress, 0),
        }
      ])
    })

    it('4.5 工具函数', async () => {
      const ether = '1'
      const etherToWei = ethers.parseEther(ether)

      const wei = '1000000000000000000'
      const weiToEther = ethers.formatEther(wei)

      const gwei = '1'
      const gweiToWei = ethers.parseUnits(gwei, 'gwei')
      const gweiToEther = ethers.formatUnits(gwei, 'gwei')
      const gweiToEtherNumeric = ethers.formatUnits(gwei, 9)

      console.table([
        {
          'parseEther(ether: string)⇒ bigint: ether 转 wei;': `${ether} ether: ${etherToWei} wei; length: ${String(etherToWei).length}`,

          'formatEther(wei: BigNumberish)⇒ string': `${wei} wei: ${weiToEther} ether`,

          'parseUnits(value: string, unit?: string | Numeric)⇒ bigint': `${gwei} gwei: ${gweiToWei} wei; ${String(gweiToWei).length}`,

          'formatUnits(value: BigNumberish, unit?: string)⇒ string': `${gwei} gwei: ${gweiToEther} ether`,

          'formatUnits(value: BigNumberish, unit?: Numeric)⇒ string': `${gwei} gwei: ${gweiToEtherNumeric} ether`,

          'getAddress(address: string)⇒ string': ethers.getAddress(addressAccount),

          'computeAddress(key: string | SigningKey)⇒ string': ethers.computeAddress(`0x${PRIVATE_KEY}`),

          'isAddress(value: any)⇒ boolean': ethers.isAddress(addressAccount),
        }
      ])
      console.log('format开头: 转为 ether')
      console.log('parse开头: 转为 wei')
    })
  })

  describe('5.读取合约状态', async () => {

    it('5.2 只读调用', async () => {
      const exampleContract = new ethers.Contract(exampleContractAddress, exampleArtifact.abi, wallet)
      console.table([
        {
          'getAddress()': await exampleContract.getAddress(),

          'count();': await exampleContract.count(),

          'getCount(); addCount之前': await exampleContract.getCount(),

          'addCount()': await (await exampleContract.addCount()).wait(),

          'getCount(); addCount之后': await exampleContract.getCount(),
        }
      ])
    })

    it('5.3 处理复杂返回值', async () => {
      const exampleContract = new ethers.Contract(exampleContractAddress, exampleArtifact.abi, wallet)
      const info = await exampleContract.info()
      console.table([
        {
          ownerAddress: info.ownerAddress,
          contractAddress: info.contractAddress,
          timestamp: info.timestamp,
        }
      ])
    })

    it('5.4 错误处理', async () => {
      const exampleContract = new ethers.Contract(exampleContractAddress, exampleArtifact.abi, wallet)
      try {
        // const tx = await exampleContract.addCount(0n) // 其他错误: ambiguous function description (i.e. matches "addCount(uint256)", "addCount()") (argument="key", value="addCount", code=INVALID_ARGUMENT, version=6.16.0)
        const tx = await exampleContract['addCount(uint256)'](0n) // 重载函数的调用方式

        const receipt = await tx.wait()
        // console.log(receipt)
      } catch (error: any) {
        // CALL_EXCEPTION：合约调用失败
        // INVALID_ARGUMENT：参数错误
        // NETWORK_ERROR：网络错误
        // UNPREDICTABLE_GAS_LIMIT：Gas估算失败
        if (error.code === 'CALL_EXCEPTION') {
          console.error('合约调用失败:', error.message);
        } else {
          console.error('其他错误:', error.message);
        }
      }
    })


  })

  describe('6. 监听事件', async () => {
    it('6.2 监听合约事件', async () => {
      const exampleContract = new ethers.Contract(exampleContractAddress, exampleArtifact.abi, wallet)
      const val = 2n
      exampleContract.on('Increment', (newVal, log) => {
        // exampleContract.once('Increment', (newVal, log) => {
        console.log(log)
        console.table([
          {
            val: val,
            'log': log,
          }
        ])
      })
      const tx = await exampleContract['addCount(uint256)'](val)
      const receipt = await tx.wait()
      expect(receipt.status).to.equal(1)
    })

    it('6.3 查询历史事件', async () => {
      const exampleContract = new ethers.Contract(exampleContractAddress, exampleArtifact.abi, wallet)
      const filter = exampleContract.filters.Increment()
      const events = await exampleContract.queryFilter(filter)
      // const events = await exampleContract.queryFilter(filter, 10700000, 10800000)
      // https://sepolia.etherscan.io/address/0xa46018d65e7e26ba3e85f76ac0dbfad75e031af7
      console.table(events)
    })

    it('6.4 监听区块事件', () => {
      provider.on('block', (blockNumber) => {
        console.log('新区块:', blockNumber);
      });
    })

    it('6.5 监听网络变化', () => {
      provider.on('network', (newNetwork, oldNetwork) => {
        console.log('网络切换:', oldNetwork?.name, '->', newNetwork.name);
        // 重新初始化应用状态
      });
    })

    it('6.6 事件监听最佳实践', async () => {
      // const exampleContract = new ethers.Contract(exampleContractAddress, exampleArtifact.abi, wallet)
      // await exampleContract.on('error', error => {
      //   console.log(error)
      // });
    })
  })
})