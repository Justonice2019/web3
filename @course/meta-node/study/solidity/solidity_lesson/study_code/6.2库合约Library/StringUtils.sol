// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library StringUtils {
    function concat(string memory a, string memory b)
    internal pure returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    function testEncodePacked(string memory a, string memory b) public pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }
}

// 多个合约可以复用StringUtils
contract Contract1 {
    function combine(string memory a, string memory b)
    public pure returns (string memory)
    {
        return StringUtils.concat(a, b);
    }
}

contract Contract2 {
    function join(string memory x, string memory y)
    public pure returns (string memory)
    {
        return StringUtils.concat(x, y);
    }
}