// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0 < 0.9.0;

contract StructTest {
    struct Hobbit {
        string name;
        string level;
    }

    struct Person {
        string name;
        uint8 age;
        Hobbit[] hobbits;
        // mapping (string => string) record; // mapping不可以写进到结构体
    }

    Person[] public persons;

    function setPerson (Person calldata p) public {
        persons.push(p);
    }
}

contract UserManager {
    struct User {
        string name;
        uint256 age;
        address wallet;
    }
    mapping (address wallet => User p) public users;

    function setUser (string memory name, uint256 age) public {
        address addr = msg.sender;
        User memory user = User(name, age, addr);
        users[addr] = user;
    }

    function getUser (address addr) public view returns (User memory) {
        return users[addr];
    }
}