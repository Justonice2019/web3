// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Sum {
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
