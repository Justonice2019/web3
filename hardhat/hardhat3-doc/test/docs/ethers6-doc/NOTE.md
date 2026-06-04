## provider - 提供商
* const provider = await ethers.getDefaultProvider(); 获取公共节点提供商
* const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL); 获取指定节点提供商
* provider.call(tx); 执行calldata
  ````
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
  ````
* const tx = await provider.getTransaction(txHash); 根据交易hash获取交易
### 监听事件
* provider.on("pending", listener); 监听 mempool(注意不要在mocha环境下执行逻辑, 直接在node下执行就可以)
* provider.once("pending", listener); 监听一次

## wallet - 钱包
* const wallet = new ethers.Wallet(PRIVATE_KEY, provider); 获取钱包实例
  ````
  Wallet {
      provider: JsonRpcProvider {},
      address: '0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885'
  }
  ````
* const wallet2 = ethers.Wallet.fromPhrase(phrase); 根据助记词获取钱包实例, phrase大约为: 'xxx yyy zzz ...'
* const wallet2WithProvider = wallet2.connect(provider); 钱包连接上提供商
* const walletRandom = ethers.Wallet.createRandom(); 获取随机的钱包实例
  ````
  HDNodeWallet {
      provider: null,
      address: '0x5327a9C45801f92184D1Bbc6B72F860E94A98c51',
      publicKey: '0x02f417fd7712adb6639182dc2ba52b7c7b413ee889cfdc944d01782c4f759bf095',
      fingerprint: '0xac7330f5',
      parentFingerprint: '0x3e4f7518',
      mnemonic: Mnemonic {
        phrase: 'firm jacket spoil supreme nasty zone local ranch shrimp razor trade useless',
        password: '',
        wordlist: LangEn { locale: 'en' },
        entropy: '0x574ee3496cf933ffa0d58cc736579af8'
      },
      chainCode: '0x893679557507dbb45867a1fc9f99355cb4583b666475da3ddab53edfbd3241a9',
      path: "m/44'/60'/0'/0/0",
      index: 0,
      depth: 5
  }  
  ````
* const balance = await provider.getBalance('vitalik.eth'); 查询余额
* const balance = await provider.getBalance(await wallet.getAddress()); 查询余额
* await provider.getTransactionCount('vitalik.eth'); 查看地址交易数
* await provider.getTransactionCount(await wallet.getAddress()); 查看地址交易数
* const wallet1 = ethers.Wallet.createRandom(); 创建随机的wallet对象
  ````
  HDNodeWallet {
      provider: null,
      address: '0xC145276DA00c89c9B1257445092Ff516a1757197',
      publicKey: '0x0347ef6287497919330fcf18fb934631ed38eb2ba1804d65fad28215849ad64c89',
      fingerprint: '0x26698e92',
      parentFingerprint: '0x856d615c',
      mnemonic: Mnemonic {
        phrase: 'pumpkin dynamic response solution fuel speak enemy rich domain dream nation decade',
        password: '',
        wordlist: LangEn { locale: 'en' },
        entropy: '0xada89adee765dfa1927dca40e8524d1c'
      },
      chainCode: '0xf1273298c0a223c3e93919251cf71f96237ae1fe87af4aa11ffcbf0741a55cdc',
      path: "m/44'/60'/0'/0/0",
      index: 0,
      depth: 5
  }
  ````
* const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32)); 随机生成助记词
* const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath); 生成基础钱包
* baseWallet.derivePath(i.toString()); 根据基础钱包生成多个钱包
  ````
  // 生成随机助记词
  const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));
  // 创建HD基钱包
  const basePath = "44'/60'/0'/0";
  const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath);
  const numWallet = 20;
  let wallets = [];
  for (let i = 0; i < numWallet; i++) {
      let baseWalletNew = baseWallet.derivePath(i.toString());
      console.log(`第${i + 1}个钱包地址： ${baseWalletNew.address}`);
      wallets.push(baseWalletNew);
  }
  ````

## block - 区块链
* (await provider.getNetwork()).toJSON(); 查看链网络
  ````
  { name: 'sepolia', chainId: '11155111' }  
  ````
* const blockNumber = await provider.getBlockNumber(); 查看区块编号(区块当前高度)
* await provider.getFeeData();
  ````
  FeeData {
  gasPrice: 22900270753n,
  maxFeePerGas: 45799187906n,
  maxPriorityFeePerGas: 1353600n
  }
  ````
* await provider.getBlock(10980403)
  ````
  Block {
     provider: JsonRpcProvider {},
     number: 10980403,
     hash: '0x4cdc09b0af8a5c2d11e024e8d0b4826d0f9cca090a3839afe6f6c45721e8b0f4',
     timestamp: 1780477404,
     parentHash: '0x5ad8e611bc6fad94fa2f497154db45bf4de92dc19f3b8905c662bf36b421bb73', // 这个hash指向的是 10980402区块号的hash
     parentBeaconBlockRoot: '0xfab22b52208d2e80155559313e4c43a090fe58d419fd951fccd793afd14ea113',
     nonce: '0x0000000000000000',
     difficulty: 0n,
     gasLimit: 60000000n,
     gasUsed: 32029052n,
     stateRoot: '0xcc2fd6069def92b204a21213c270c48417ff887293edbb9debad059e6f1bea97',
     receiptsRoot: '0xe71c20473ea6318fe3564327b282e167b3f3ed6130817e0f8d9948fccdd4b6e6',
     blobGasUsed: 1441792n,
     excessBlobGas: 238880095n,
     miner: '0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7',
     prevRandao: '0xce735cb598cdf34924a29e108cd3daef387ca8f010a6308a15f47bc73643da0a',
     extraData: '0x4e65746865726d696e642076312e33382e30',
     baseFeePerGas: 11971628133n
  }
  ````
* await provider.getCode('0x99bb391a6fa6Cb8cb0941f986373869129E58d11'); 查询某个地址的合约 bytecode

## contract - 合约

### 获取合约实例
* const exampleContract = new ethers.Contract(EXAMPLE_SEPOLIA_ADDR, EXAMPLE_ARTIFACT.abi, wallet); 获取已部署的合约实例
* const metaNodeFactory = new ContractFactory(MetaNodeArtifact.abi, MetaNodeArtifact.bytecode, wallet); 获取合约工厂
* const metaNode = await metaNodeFactory.deploy('MetaNodeToken', 'MMT'); 部署合约
 
### 调用合约属性和方法
* await exampleContract.count(); 调用getter函数, count本质是个属性
* const count = await exampleContract.getCount(); 调用函数, 函数类型为 view/pure 无需等待 
* const receipt = await (await exampleContract.addCount()).wait(); 调用函数, 设计到写入操作, 需要 await 等待
* const receipt = await (await exampleContract['addCount(uint256)'](2n)).wait(); 调用重载函数

### 合约内置方法
* const result = await exampleContract.queryFilter('Increment', 0, 'latest'); 查询当前合约指定区块高度 Increase 事件
  ````
  [
        EventLog {
        provider: JsonRpcProvider {},
        transactionHash: '0x5d187e4651b1ae23995ca80995a59e178e0eb2e1d4567211f4f8c90ab473ec3e',
        blockHash: '0xf671de5f476e67729a8a0b37063bd4f3ad4948f6be1472889859f749b060893a',
        blockNumber: 10708877,
        removed: false,
        address: '0x99bb391a6fa6Cb8cb0941f986373869129E58d11',
        data: '0x0000000000000000000000000000000000000000000000000000000000000001',
        topics: [
          '0x51af157c2eee40f68107a47a49c32fbbeb0a3c9e5cd37aa56e88e6be92368a81'
        ],
        index: 859,
        transactionIndex: 91,
        interface: Interface {
          fragments: [Array],
          deploy: [ConstructorFragment],
          fallback: null,
          receive: false
        },
        fragment: EventFragment {
          type: 'event',
          inputs: [Array],
          name: 'Increment',
          anonymous: false
        },
        args: Result(1) [ 1n ]
    },
  ]
  ````
* const filter1 = metaNodeContract.filters.Transfer(wallet1); 过滤事件
  ````
  // event Transfer(address indexed from, address indexed to, uint256 value);
  const filter1 = metaNodeContract.filters.Transfer(wallet1)
  metaNodeContract.on(filter1, (...args) => {
    console.log(args)
  })

  const filter2 = metaNodeContract.filters.Transfer(null, null, 100n)
  metaNodeContract.on(filter2, (...args) => {
    console.log(args) // 因为value没有indexed修饰, 就算满足条件也是无法被过滤出来的
  })
  ````
* exampleContract.on(eventName, callback); // 持续监听事件
* exampleContract.once(eventName, callback); // 监听一次事件
  ````
  exampleContract.on('Increment', (...args) => {
    console.log(args)
  })
  [
      2n, // 前面的是事件的实参
      ContractEventPayload { // 最后一个是事件
        filter: 'Increment',
        emitter: Contract {
          target: '0x99bb391a6fa6Cb8cb0941f986373869129E58d11',
          interface: [Interface],
          runner: [Wallet],
          filters: {},
          fallback: null,
          [Symbol(_ethersInternal_contract)]: {}
        },
        log: EventLog {
          provider: JsonRpcProvider {},
          transactionHash: '0x1efe7f64f62738b347807abfc9e34ff72bc23673e46d1626c680cf5bcaa71aa3',
          blockHash: '0x440b710ad206a9d9753a2e2bb3eea6e89d24cc165f0bab2a37d64dde3cdc6379',
          blockNumber: 10981776,
          removed: false,
          address: '0x99bb391a6fa6Cb8cb0941f986373869129E58d11',
          data: '0x0000000000000000000000000000000000000000000000000000000000000002',
          topics: [Array],
          index: 506,
          transactionIndex: 226,
          interface: [Interface],
          fragment: [EventFragment],
          args: [Result]
        },
        args: Result(1) [ 2n ],
        fragment: EventFragment {
          type: 'event',
          inputs: [Array],
          name: 'Increment',
          anonymous: false
        }
      }
  ]
  ````
* metaNodeContract.transfer.staticCall(...args, options); 模拟调用, 不消耗gas, 防止浪费gas
  ````
  const provider = new ethers.JsonRpcProvider(SEPOLIA_HTTPS_RPC_URL)
  const wallet1 = new ethers.Wallet(PRIVATE_KEY_1, provider)

  const metaNodeContract = new ethers.Contract(META_NODE_SEPOLIA_ADDR, META_NODE_ARTIFACT.abi, wallet1)
  const balance = await metaNodeContract.balanceOf(await wallet1.getAddress())

  const tx1 = await metaNodeContract.transfer.staticCall(WALLET2_ADDR, balance, {
    from: await wallet1.getAddress() // 可选
  })
  console.log(tx1)
  
  // 这个超出了余额tx2就会报错 需要用法 catch捕获这个错误
  const tx2 = await metaNodeContract.transfer.staticCall(WALLET2_ADDR, balance + 1n, {
    from: await wallet1.getAddress() // 可选
  })
  console.log(tx2)
  ````

## interface - 编码解码器

* const selector = inter.getFunction('transfer').selector
  ````
  const inter = new ethers.Interface([
      'function transfer(address, uint) public returns (bool)'
      ])
  const selector = inter.getFunction('transfer').selector
  ````
* const decoded = inter.parseTransaction({ data: tx.data });

## 工具函数
* const formattedBalance = ethers.formatEther(balance); 转为 ETH
* const parsedBalance = ethers.parseEther(balance); 转为 wei
* ethers.formatUnits(oneGWei, 9); 小单位转大单位; 1000000000 => '1.0'
  * ethers.formatUnits(oneGWei, 'gwei'); 小单位转大单位; 1000000000 => '1.0'
* ethers.getBigInt('9007199254740991'); 9007199254740991n
  * ethers.getBigInt(9007199254740991); 9007199254740991n
  * ethers.getBigInt(0x1fffffffffffff);
  * ethers.getBigInt(0x1fffffffffffff); 
