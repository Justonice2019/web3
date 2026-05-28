// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TestBytes {
    string public str = "hello";

    function str2Bytes () public view returns (bytes memory) {
        return bytes(str); // 0x68656c6c6f
    }
}