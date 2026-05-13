// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    function deposit() public payable {
        // 接收 ETH
    }

    function withdraw(uint256 amount) public {
        // 发送 ETH xxxxxxxxxxx
    }

    function getBytes(string memory str) public pure returns (bytes memory) {
        // 可以将任何字符串转换为动态字节数组
        return bytes(str);
    }
    function getHash(string memory str) public pure returns (bytes32) {
        // 可以将任何字符串转换为hash
        return keccak256(bytes(str));
    }
}