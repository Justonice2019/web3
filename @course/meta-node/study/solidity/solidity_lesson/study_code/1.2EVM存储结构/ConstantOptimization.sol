// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConstantOptimization {
    uint256 public MAX_SUPPLY1 = 10000;
    uint256 public constant MAX_SUPPLY2 = 10000;
    address public admin1; // 可以在别的函数去设置
    address public immutable ADMIN2;

    constructor() {
        ADMIN2 = msg.sender; // 只能在构造函数中设置
    }

    function getMaxSupply1() public view returns (uint256) {
        return MAX_SUPPLY1;
    }

    // 使用的是 constant 甚至可以直接申明为 view
    function getMaxSupply2() public pure returns (uint256) {
        return MAX_SUPPLY2;
    }
}
