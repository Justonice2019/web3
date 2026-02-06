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
    // using MathOperations for uint256;
    // using MathOperations for uint; // uint 也可以
    // using MathOperations for uint8; // err:

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a.add(b);
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256) {
        return a.sub(b);
    }
}
using MathOperations for uint; // 在最顶层也可以用, 声明写后面也行
