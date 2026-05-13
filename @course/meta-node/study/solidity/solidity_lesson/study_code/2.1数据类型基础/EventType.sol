// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract EventType {
    enum Status {
        PENDING,
        RESOLVE,
        REJECT
    }
    event StatusChange(address addr, Status newStatus);

    function changeStatus(Status newStatus) public {
        emit StatusChange(msg.sender, newStatus);
    }
    function changeStatusString(
        Status newStatus
    ) public view returns (string memory) {
        // return string.concat(addressToStirng(msg.sender), ":", statusToString(newStatus));
        return string.concat(Strings.toHexString(uint256(uint160(msg.sender))), ":", statusToString(newStatus));
    }
    function addressToStirng(address addr) public pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    // 辅助函数：枚举转字符串
    function statusToString(
        Status status
    ) internal pure returns (string memory) {
        if (status == Status.PENDING) return "PENDING";
        if (status == Status.RESOLVE) return "RESOLVE";
        if (status == Status.REJECT) return "REJECT";
        return "Unknown";
    }
}
