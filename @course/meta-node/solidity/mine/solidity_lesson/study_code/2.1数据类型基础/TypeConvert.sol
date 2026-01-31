// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TypeConvert {
    function explicitConvert() public pure returns (uint8) {
        uint256 big = 300;
        uint8 small = uint8(big);  // 需要显式转换
        // 警告：300转为uint8会溢出！
        // 结果：44（300 % 256 = 44）
        return small; // 44
    }
}