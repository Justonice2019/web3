// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Utils.sol";

using Utils for uint256;

contract TestBlock {

    // 块
    function getBlock() public {
        emit Utils.LogUint256(block.timestamp);  // 1778656007 (单位秒)
    }

}