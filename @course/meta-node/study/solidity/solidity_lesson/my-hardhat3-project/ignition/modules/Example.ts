import {buildModule} from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule("ExampleModule", m => {
  const example = m.contract("Example", [0n])
  return {
    example
  };
})