// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Utils.sol";

using Utils for uint256;

contract TestString {

    // 获取长度
    function getLen() public {
        string memory str = "hello";
        // emit Utils.LogStr(str.length); // err
        bytes memory b = bytes(str);
        emit Utils.LogBytes(b); // 0x68656c6c6f
        emit Utils.LogUint256(b.length); // 5
    }

}