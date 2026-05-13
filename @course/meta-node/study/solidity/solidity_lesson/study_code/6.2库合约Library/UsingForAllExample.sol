// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/Strings.sol";

library Convert {
    // uint public value; // err: 库不能有状态变量
    function toStr(uint160 value) internal pure returns (string memory) {
        if (value == 0) return "0";

        // 获取最大位数（只在编译时计算一次）
        uint256 maxDigits = getDigits(160); // 或调用 getMaxDigitsForUint160()

        bytes memory buffer = new bytes(maxDigits);
        uint256 ptr = maxDigits;
        uint160 temp = value;

        while (temp > 0) {
            ptr--;
            buffer[ptr] = bytes1(uint8(48 + (temp % 10)));
            temp /= 10;
        }

        // 提取有效部分
        uint256 length = maxDigits - ptr;
        bytes memory result = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = buffer[ptr + i];
        }

        return string(result);
    }

    function getDigits(uint256 value) internal pure returns (uint256) {
        if (value == 0) return 1; // 0 也算1位数

        uint256 digits = 0;
        uint256 temp = value;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        return digits;
    }
    function getMaxDigitsForUintType(
        uint256 bits
    ) public pure returns (uint256) {
        // bits: 8, 16, 32, 64, 128, 160, 256 等

        // 计算该位数的最大值
        uint256 maxValue;

        if (bits == 256) {
            maxValue = type(uint256).max;
        } else if (bits == 128) {
            maxValue = type(uint128).max;
        } else if (bits == 64) {
            maxValue = type(uint64).max;
        } else if (bits == 32) {
            maxValue = type(uint32).max;
        } else if (bits == 16) {
            maxValue = type(uint16).max;
        } else if (bits == 8) {
            maxValue = type(uint8).max;
        } else if (bits == 160) {
            maxValue = type(uint160).max;
        } else {
            // 对于非常规位数，使用位运算计算最大值
            require(bits <= 256, "Bits must be <= 256");
            maxValue = (1 << bits) - 1;
        }

        // 计算最大值的位数
        return getDigits(maxValue);
    }
}

contract Calculator {
    using Strings for uint8;
    using Strings for uint256;
    using Convert for uint160;

    function toString(
        uint8 ui8,
        uint256 ui256,
        uint160 ui160
    ) public pure returns (string memory, string memory, string memory) {
        return (ui8.toString(), ui256.toString(), ui160.toStr());
    }
}
