// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
uint8   // 0 到 255
uint16  // 0 到 65,535
uint32  // 0 到 4,294,967,295
uint64  // 0 到 18,446,744,073,709,551,615
uint128 // 0 到 2^128-1
uint256 // 0 到 2^256-1

// uint 等同于 uint256
uint public count;  // 等同于 uint256 public count;

int8    // -128 到 127
int16   // -32,768 到 32,767
int32   // -2,147,483,648 到 2,147,483,647
int64   // -2^63 到 2^63-1
int128  // -2^127 到 2^127-1
int256  // -2^255 到 2^255-1

// int 等同于 int256
int public balance;  // 等同于 int256 public balance;
*/
contract ValueTypes {
    function getTypes()
        public
        pure
        returns (bool, int, int8, int8, int16, int16)
    {
        // 返回参数不能太多会报错的
        // function getTypes() public pure returns (bool, int, int8, int16, int128, int256, address, bytes1, bytes2, bytes32) {
        bool b = false;
        int i = 1;
        int8 i8b = -128;
        int8 i8e = 127;
        int16 i16b = -32768;
        int16 i16e = 32767;
        return (b, i, i8b, i8e, i16b, i16e);
    }

}


