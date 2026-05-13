import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestModule", (m) => {
  // 先部署Token合约
  // const token = m.contract("Token", [1000n]);

  const flag = m.getParameter('flag')
  console.log(`flag: ${flag}`)
  // 这个 flag 输出出来是一个对象, 但是可以作为实参传递给 solidity 中的函数并且调用

  // 然后部署Vault合约，传入Token地址
  const test = m.contract("Test");

  m.call(test, "setFlag", [flag]);
  // {
  //   "$global": {
  //     "flag": true
  //   },
  //   "VaultModule": {
  //     "_supply": "1000n",
  //     "flag": false
  //   }
  // }
  // 在 /test/Test.ts 会被 解析成 true 的

  return { test };
});