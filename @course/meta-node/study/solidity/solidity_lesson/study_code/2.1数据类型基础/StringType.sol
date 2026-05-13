// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StringType {
    function testEncodePacked(
        string memory str
    ) public pure returns (bytes memory) {
        return abi.encodePacked(str); // 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000
    }
    function testEncode(string memory str) public pure returns (bytes memory) {
        return abi.encode(str); // 0x68656c6c6f
    }

    function testKeccak256(string memory str) public pure returns(bytes32) {
        // return keccak256(str); // err
        bytes memory b = abi.encodePacked(str);
        return keccak256(b); // 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
    }

    function test2Keccak256() public pure returns(bytes32) {
        // 这里存在隐式转换 先将字符串字面量转为 bytes 在进行 keccak256
        return keccak256("hello"); // 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
    }
}
