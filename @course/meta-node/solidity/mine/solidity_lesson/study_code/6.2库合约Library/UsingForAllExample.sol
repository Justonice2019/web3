// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Convert {
    // uint public value; // err: 库不能有状态变量

    function toString(uint256 value) internal pure returns (string memory) {
        return string(abi.encodePacked(value));
    }
}

contract Calculator {
    using Convert for *;

    function uintToString(uint256 value) public pure returns (string memory) {
        return value.toString();
    }

    
}

