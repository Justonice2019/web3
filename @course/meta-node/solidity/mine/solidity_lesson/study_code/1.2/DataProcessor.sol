// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataProcessor {
    uint256[] private results;  // Storage - 永久保存结果
    
    // Calldata - 外部参数且只读
    function batchProcess(
        uint256[] calldata inputs
    ) external {
        // Memory - 临时存储中间结果
        uint256[] memory temp = new uint256[](inputs.length);
        
        for (uint i = 0; i < inputs.length; i++) {
            temp[i] = inputs[i] * 2;  // 从calldata读取，写入memory
        }
        
        // 最后写入storage
        for (uint i = 0; i < temp.length; i++) {
            results.push(temp[i]);  // 从memory读取，写入storage
        }

        
        // for (uint i = 0; i < inputs.length; i++) {
        //     results.push(inputs[i]);  // 从memory读取，写入storage
        // }
    }

    function getResults () public view returns (uint256[] memory) {
        return results;
    }
}