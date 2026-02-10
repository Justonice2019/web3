// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ErrorExample {
    function funcA () public pure {
        funcB();
        require(true, "A failed");
    }

    function funcB() public pure {
        require(false, "B failed");
    }

    function add(uint8 a, uint8 b) public pure returns (uint8) {
        uint8 c = a + b;
        assert(false);  // 检查是否溢出
        return c;
    }

    // 定义不带参数的错误
    error Unauthorized();
    // 定义带参数的错误
    error InsufficientBalance(uint256 available, uint256 required);
    // 定义带多个参数的错误
    error InvalidTransfer(address from, address to, uint256 amount, string reason);

    function testUnauthorized(uint a, uint b) public view {
        if (a > b) {
            revert Unauthorized();
        }
        if (a == b) {
            revert InsufficientBalance(a, b);
        }
        if (a < b) {
            revert InvalidTransfer(msg.sender, address(this), 1000, "haha");
        }
    }
}