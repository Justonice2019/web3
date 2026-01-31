// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// 枚举本质是 uint8 ，比使用string存储状态更省gas。
contract enumType {
    enum Status {
        Pending,    // 0
        Approved,   // 1
        Rejected,   // 2
        Cancelled   // 3
    }

    function logEnumItem () public pure returns (uint8) {
        // return Status.Approved; //err
        return uint8(Status.Approved); // 1
    }
}