// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ArrayTest {
    function testArr1() public pure returns (uint[10] memory) {
        uint[10] memory tens;
        return tens;
    }

    // 固定数组长度
    function testArrFixed() public pure returns (uint256[] memory) {
        uint256[] memory tens = new uint256[](10);
        for (uint256 i = 0; i < 10; i++) {
            tens[i] = 100 + i;
            // tens.push(100 + i); // TypeError: Member "push" is not available in uint256[] memory outside of storage.
        }
        return tens;
    }
    function testArrFixed2() public pure returns (uint256[3] memory) {
        // uint256[3] memory tens = [1, 2, 3]; // TypeError: Type uint8[3] memory is not implicitly convertible to expected type uint256[3] memory. --> 1.3.2-数组.sol:20:9:
        uint256[3] memory tens = [uint256(1), 2, 3]; // 默认情况下会把1,2,3推断为uint8, 所以需要强转下
        return tens;
    }

    // 静态数组
    uint256[] public arr1;
    uint256[] public arr2 = [1, 2, 3];
    uint256[] public arr3 = new uint256[](5);
    uint256[4] public arr4;
    uint256[5] public arr5 = [1, 2, 3, 4, 5];
    function readArr()
        external
        view
        returns (
            uint256[] memory d1,
            uint256 len1,
            uint256[] memory d2,
            uint256 len2,
            uint256[] memory d3,
            uint256 len3,
            uint256[4] memory d4,
            uint256 len4,
            uint256[5] memory d5,
            uint256 len5
        )
    {
        d1 = arr1;
        len1 = arr1.length;
        d2 = arr2;
        len2 = arr2.length;
        d3 = arr3;
        len3 = arr3.length;
        d4 = arr4;
        len4 = arr4.length;
        d5 = arr5;
        len5 = arr5.length;
    }

    // 动态数组
    uint[] public dynamicArray;
    function addElement(uint _element) public returns (uint[] memory) {
        dynamicArray.push(_element);
        return dynamicArray;
    }
    function removeLastElement() public returns (uint[] memory) {
        dynamicArray.pop();
        return dynamicArray;
    }
    function getLength() public view returns (uint) {
        return dynamicArray.length; // 获取数组长度
    }

    bytes public bs = "abc\x22\x22";
    bytes public data = new bytes(10);

    function readBytesByIndex(uint256 index) public view returns (int256) {
        for (uint256 i = 0; i < bs.length; i++) {
            if (bs[i] == bs[index]) {
                return int256(i);
            }
        }
        return -1;
    }
    function readBytesByIndexStep1(uint256 index) public view returns (bytes1) {
        return bs[index];
    }
    function readBytesByIndexStep2(bytes1 b) public view returns (int256) {
        for (uint256 i = 0; i < bs.length; i++) {
            if (bs[i] == b) {
                return int256(i);
            }
        }
        return -1;
    }

    string public str;
    string public str2 = "abc\u718A";

    // function readStrByIndex(uint256 index) public view returns (bytes1) {
    //     return str[index]; // TypeError: Index access for string is not possible. // 字符串不可以直接这样读取
    // }

    // 切片: 就是截取
    function testSlice(bytes calldata data2, uint256 start, uint256 end) public pure returns (bytes memory) {
        return data2[start:end];
    }
}