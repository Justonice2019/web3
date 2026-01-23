// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract DataTypeTest {
    // 基本数据类型
    string public name = "Tom";
    uint8 public age = 18;
    int public money = 356;
    bool public isMale = false;
    address public a = 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885; // 16进制 keccak256 函数生成的才行
    bytes2 public b1 = 0x0000;
    bytes3 public b2 = hex"1000";
    enum Status {
        Active,
        Inactive
    }

    // 引用类型
    int[] arrInt;
    string[] arrString;
    bool[] arrBool;
    // ...

    // 结构体
    struct Person {
        string name;
        uint8 age;
        bool isMale;
    }
    Person public p1 = Person('Tom', 18, true);
    Person public p2 = Person({
        isMale: false,
        age: 21,
        name: "Jim"
    });
}
