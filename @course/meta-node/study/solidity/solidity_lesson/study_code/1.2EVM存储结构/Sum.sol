// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SumContract {
    // 消耗gas: 2685
    function getSumMemory(uint[] memory data) public pure returns (uint) {
        uint sum = 0;
        for (uint i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum;
    }
    // 消耗gas: 1610
    function getCalldata(uint[] calldata data) public pure returns (uint) {
        uint sum = 0;
        for (uint i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum;
    }
}


/*
### 1.2 三种存储位置的核心特性对比
| 特性 | Storage | Memory | Calldata |
|------|---------|--------|----------|
| **存储时长** | 永久保存 | 函数执行期间 | 函数执行期间 |
| **可修改性** | 可读可写 | 可读可写 | 只读 |
| **Gas成本** | 最高 | 中等 | 最低 |
| **典型用途** | 状态变量 | 临时数据 | 外部参数 |
| **SLOAD成本** | 2,100+ gas | - | - |
| **SSTORE成本** | 20,000 gas (首次) | - | - |

*/