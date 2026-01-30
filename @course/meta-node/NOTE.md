# hardhat
### 命令
````shell
# 安装
mkdir hardhat-demo3
cd hardhat-demo3
npm init -y
npm install --save-dev hardhat

# 初始化
npx hardhat --init
## 选择 Hardhat 3
## 选择 mocha and ethers.js

# scripts
npx hardhat compile # 编译合约, 生成 artifacts 目录, 类似于 remix 的编译结果
npx hardhat test # 运行测试: ./contracts/Counter.t.sol ./test/Counter.ts 
npx hardhat test solidity # 运行测试: ./contracts/Counter.t.sol 
npx hardhat test mocha # 运行测试: ./test/Counter.ts 
npx hardhat run ./scripts/send-op-tx.ts --network hardhatOp # 允许本地测试网络发送交易
npx hardhat ignition deploy ignition/modules/Counter.ts # 部署合约到本地测试网络, 并打印交易哈希 0x5FbDB2315678afecb367f032d93F642f64180aa3(这个我能在区块链浏览器查询到)
npx hardhat ignition deploy ignition/modules/Counter.ts --network sepolia # 部署合约到本地测试网络

## 需要配置 SEPOLIA_RPC_URL SEPOLIA_PRIVATE_KEY
npx hardhat keystore set SEPOLIA_RPC_URL --force # 配置 Sepolia 网络的节点地址: https://sepolia.infura.io/v3/e13648d8a1f64b839a17533b1bd2d981 (从https://developer.metamask.io/key/active-endpoints申请获取)
npx hardhat keystore set SEPOLIA_PRIVATE_KEY --force # 配置 Sepolia 网络的私钥: 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885 (metamask账户信息里面的私钥复制)
npx hardhat keystore set PASSWORD # 配置密码, 后续运行时需要输入这个密码

## 首次运行需要设置密码, 自己设置一个密码, 后续运行时需要输入这个密码
npx hardhat ignition deploy ignition/modules/Counter.ts --network sepolia # 部署合约到 Sepolia 测试网络, 注意有些公司内部网络可能因为防火墙会失败,切换移动网络试试
## 0x96B8319440c923174250b72D113943f51849277B 这个合约是我在 Sepolia 测试网络部署的合约, 通过 https://sepolia.etherscan.io/address/0x96B8319440c923174250b72D113943f51849277B 可以查询到
npx hardhat keystore list # 查看配置的网络和私钥
````
# solidity
## 已部署成功且可以正式运行的合约
| 合约 | Sepolia合约地址                                | Sepoliatoken地址  |   |
|--------------------------------------------------------------------------------------|--------------------------------------------|---|---|
| [Bank.sol](solidity%2Fmine%2Fsolidity_lesson%2Fhardhat-demo2%2Fcontracts%2FBank.sol) | 0x01fC441BeFb115906e3D27d39C2155fF106e80B2 |   |   |
| [MetaNode.sol](solidity%2Fmine%2Fsolidity_lesson%2Fhardhat-demo2%2Fcontracts%2FMetaNode.sol) |  |  0x04CB08cC6A4fB789FC9fDeBb0701743F0E10A4Cb |   |
| [MetaNodeStake.sol](solidity%2Fmine%2Fsolidity_lesson%2Fhardhat-demo2%2Fcontracts%2FMetaNodeStake.sol) | 0x5C140afb6D6977cA9199A577aB0575fCc6df2169 |   |   |

## 已部署的合约
| 合约 | Sepolia合约地址                                | Sepoliatoken地址  |   |
|--------------------------------------------------------------------------------------|--------------------------------------------|---|---|
| [MetaNode.sol](solidity%2Fmine%2Fsolidity_lesson%2Fhardhat-demo2%2Fcontracts%2FMetaNode.sol) |  |  0xf5976d2b843E884a605b7a997d49d4c9FA2981e0 |   |
| [MetaNodeStake.sol](solidity%2Fmine%2Fsolidity_lesson%2Fhardhat-demo2%2Fcontracts%2FMetaNodeStake.sol) | 0x1CAcAcEb25f0609383Cb739d967ac17d534fa593 |   |   |

