// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IntegerType {
    function intTypes() public pure returns (int256, int256, uint256, uint256) {
        int256 i256b = -2 ** 255;
        int256 i256e = 2 ** 255 - 1;
        uint256 ui256b = 0;
        uint256 ui256e = (2 ** 255) - 1;
        return (i256b, i256e, ui256b, ui256e);
    }

    function arithmeticOperations()
        public
        pure
        returns (uint, uint, uint, uint, uint, uint)
    {
        uint a = 10;
        uint b = 3;

        return (
            a + b, // 加法：13
            a - b, // 减法：7
            a * b, // 乘法：30
            a / b, // 除法：3 (注意：只取整数部分)
            a % b, // 取模：1 (余数)
            a ** b // 幂运算：1000 (10的3次方)
        );
    }

    function division() public pure returns (uint) {
        uint a = 10;
        uint b = 3;

        return (a / b); // 3
    }

    function divideWithPrecision() public pure returns (uint) {
        uint a = 10;
        uint b = 3;

        return ((a * 1000) / b); // 实际值：3.333（需要在前端除以1000显示）
    }

    function testOverflow() public pure returns (uint8) {
        uint8 max = 255;
        // 下面这行会导致交易回退
        return max + 1; // Error: Arithmetic operation underflowed or overflowed
    }

    function testUnderflow() public pure returns (uint8) {
        uint8 min = 0;
        // 下面这行会导致交易回退
        return min - 1; // Error: Arithmetic operation underflowed or overflowed
    }

  // 使用unchecked（谨慎使用！）
    function incrementChecked(uint8 x) public pure returns (uint) {
        return x + 1;  // 不检查溢出，节省gasunchecked {
    }
    // 使用unchecked（谨慎使用！）
    function incrementUnchecked(uint8 x) public pure returns (uint) {
        unchecked {
            return x + 1;  // 不检查溢出，节省gas
        }
    }
    // 典型应用场景：循环计数器
    function sumArray(uint[] memory arr) public pure returns (uint) {
        uint sum = 0;
        for (uint i = 0; i < arr.length; ) {
            sum += arr[i];
            unchecked {
                i++;  // i不可能溢出，使用unchecked节省gas
            }
        }
        return sum;
    }

     function compare() public pure returns (bool, bool, bool, bool, bool, bool) {
        uint a = 10;
        uint b = 5;
        
        return (
            a == b,  // 等于：false
            a != b,  // 不等于：true
            a > b,   // 大于：true
            a < b,   // 小于：false
            a >= b,  // 大于等于：true
            a <= b   // 小于等于：false
        );
    }
}

contract GasComparison {
    uint256 public value256; // Gas: ~43,724
    uint128 public value128; // Gas: ~43,746 (更多！)
    uint8 public value8; // Gas: ~43,770 (最多！)
}
