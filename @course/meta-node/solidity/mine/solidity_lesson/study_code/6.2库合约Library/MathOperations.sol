// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MathOperations {
    // uint public value; // err: 库不能有状态变量

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(a >= b, "MathOperations: Subtraction overflow");
        return a - b;
    }

}

contract Calculator {

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return MathOperations.add(a, b);
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256) {
        return MathOperations.sub(a, b);
    }
}
