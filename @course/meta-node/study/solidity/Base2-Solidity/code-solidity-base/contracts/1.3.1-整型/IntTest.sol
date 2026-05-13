// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract IntTest {
    function gtFunc(uint8 x, uint8 y) public pure returns (bool) {
        return x > y;
    }
    function gteFunc(uint8 x, uint8 y) public pure returns (bool) {
        return x >= y;
    }
    function lteFunc(uint8 x, uint8 y) public pure returns (bool) {
        return x <= y;
    }
    function ltFunc(uint8 x, uint8 y) public pure returns (bool) {
        return x < y;
    }

    function add(uint8 x, uint8 y) public pure returns (uint8) {
        return x + y;
    }

    function sub(uint8 x, uint8 y) public pure returns (uint8) {
        return x - y;
    }
    function mul(uint8 x, uint8 y) public pure returns (uint8) {
        return x * y;
    }
    function div(uint8 x, uint8 y) public pure returns (uint8) {
        return x / y;
    }
    function mol(uint8 x, uint8 y) public pure returns (uint8) {
        return x % y;
    }

    // 幂 几次方
    function exp(uint8 x, uint8 y) public pure returns (uint8) {
        return x ** y;
    }

    // 溢出的情况 如果填入 255 + 1 会出现gas不足, 其实是溢出的问题
    function add2(uint8 x, uint8 y) public pure returns (uint8) {
        return x + y;
    }

    // 强转
    function add3(int8 x, uint8 y) public pure returns (uint8) {
        // return x + y;
        return uint8(x) + y;
    }
}
