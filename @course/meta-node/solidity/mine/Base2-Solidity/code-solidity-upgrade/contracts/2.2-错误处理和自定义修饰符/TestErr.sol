// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract TestErr {
    function TestRequireError(bool condition) public pure returns (uint256) {
        require(condition, "ipt is not 'true'");
        return 1;
    }

    function TestAssertError(bool condition) public pure returns (uint256) {
        assert(condition);
        return 1;
    }

    function TestRevertError(bool condition) public pure returns (uint256) {
        if (!condition) {
            revert("123");
        }
        return 3;
    }

    // 简单错误（不带参数）
    error Unauthorized();
    function TestCustomSimpleError(
        bool condition
    ) public pure returns (uint256) {
        if (!condition) {
            revert Unauthorized();
        }
        return 3;
    }

    // 带参数的错误
    error InsufficientBalance(uint256 available, uint256 required);
     function TestCustomError(
        bool condition
    ) public pure returns (uint256) {
        if (!condition) {
            revert InsufficientBalance(10, 20);
        }
        return 3;
    }
}
