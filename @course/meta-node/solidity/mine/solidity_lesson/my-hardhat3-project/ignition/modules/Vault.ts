import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VaultModule", (m) => {
  // 先部署Token合约
  // const token = m.contract("Token", [1000n]);

  const _supply = m.getParameter('_supply', '500n') // "1000n" 或者 1000 都可以
  console.log(`_supply: ${_supply}`)

  const token = m.contract("Token", [_supply]);

  // 然后部署Vault合约，传入Token地址
  const vault = m.contract("Vault", [token]);

  // 可选：给某个地址转账一些Token
  // const deployer = m.getAccount(0);
  // m.call(token, "transfer", [deployer, 1000n]);

  const account0 = m.getAccount(0);
  const account1 = m.getAccount(1);
  m.call(token, "transfer", [account1, 50n]);


  return { token, vault };
});