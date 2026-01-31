// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BytesType {
    bytes1 public b1 = 0x12;
    bytes4 public b4 = 0x12345678;
    bytes32 public b32 =
        0x1234567890123456789012345678901234567890123456789012345678901234;

    function getLength() public pure returns (uint, uint, uint) {
        // bytes1 bb1 = 0x12; // 1
        // bytes4 bb4 = 0x12345678; // 4
        // bytes32 bb32 = 0x1234567890123456789012345678901234567890123456789012345678901234; // 34
        bytes1 bb1; // 1
        bytes4 bb4; // 4
        bytes32 bb32; // 34
        return (bb1.length, bb4.length, bb32.length);
    }
     // 访问单个字节
    function accessByte() public view returns (bytes1) {
        return b32[0];  // 访问第一个字节 0x12
    }

    // hello => 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
    function storeHash(string memory str) public pure returns (bytes32) {
        return keccak256(bytes(str));
    }


    // 动态字节数组
    bytes public bytesArr;
    bytes public bytesArr2 = hex"1234"; // 这里是本来就有值的
    function getBytesArrLength() public view returns (uint256) {
        return bytesArr.length;
    }
    function pushByte1(bytes1 b) public { // 只能存入 bytes1 类型的存别的会报错的
        bytesArr.push(b);
    }
    function popByte1() public {
        bytesArr.pop();
    }
    // 在没push => 0x
    // 第一次 0x12 => 0x12
    // 第二次 0x12 => 0x1212
    function getBytesArr() public view returns (bytes memory) {
        return bytesArr;
    }
    function getBytesArrAtIndex(uint index) public view returns (bytes1) {
        require(index < bytesArr.length, "index bounds");
        return bytesArr[index];
    }


    // 字符串类型
    string public str1 = "Hello";
    string public str2 = "World";
    function getStrLength () public view returns (uint) {
        // return str1.length; // err
        return bytes(str1).length; // 5
    }
    function compareStr() public view returns (bool) {
        // return str1 == str2;  // 编译错误！
        // return bytes(str1) == bytes(str2); // err: storage指针不能直接比较：Solidity中，storage引用是地址指针，不能直接用==比较
        return keccak256(bytes(str1)) == keccak256(bytes(str2));
    }
    function concatStr() public view returns (string memory) {
        return string.concat(str1, str2, "!"); // HelloWorld!
    }
    function strToBytes () public view returns (bytes memory) {
        return bytes(str1); // Hello => 48656c6c6f
    }
    bytes public bb = hex"48656c6c6f";
    function bytesToStr () public view returns (string memory) {
        return string(bb); // 48656c6c6f => Hello
    }
 
}
