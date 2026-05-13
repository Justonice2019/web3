// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Animal {
    string name;
    string color;
}
contract StructType {
    struct Person {
        string name;
        uint age;
    }

    function getStruct() public pure returns (Animal memory, Person memory) {
        return (Animal("Dog", "black"), Person({name: "Tom", age: 12}));
    }

    struct User {
        string name;
        uint256 age;
    }

    // 状态变量
    User public admin = User("Tom", 12);

    function updateAdminStorage() public {
        User storage user = admin;
        user.name = "New Admin"; // 直接修改storage
    }

    function updateAdminMemory() public view {
        User memory user = admin;
        user.name = "New Admin"; // 不会直接改变 admin
    }

    struct UserInfo {
        string username;
        uint256 balance;
        bool exsits;
    }
    mapping(address => UserInfo) public users;

    // 包含mapping的struct的限制
    

}
