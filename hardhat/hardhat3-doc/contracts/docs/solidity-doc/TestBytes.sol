// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TestBytes {
    string public str = "hello";

    function strToBytes() public view returns (bytes memory, bytes memory) {
        return (
            bytes(str), // 0x68656c6c6f
            abi.encodePacked(str) // 0x68656c6c6f
        ); 
    }

    function strToBytes32 () public view returns (bytes32, bytes32) {
        return (
            bytes32(abi.encodePacked(str)), //  0x68656c6c6f000000000000000000000000000000000000000000000000000000
            keccak256(abi.encodePacked(str)) // 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
        );
    }
}