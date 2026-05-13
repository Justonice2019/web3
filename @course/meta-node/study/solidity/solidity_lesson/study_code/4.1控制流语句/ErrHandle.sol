// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ErrHandle {
    function testRequire(uint a, uint b) public pure returns (string memory) {
        require(a == b, "a is not equal to b");
        return "a is equal to b";
    }

    function testRevert(uint a, uint b) public pure returns (string memory) {
        if (a != b) {
            revert("a is not equal to b");
        }

        return "a is equal to b";
    }

    address private immutable owner;
    uint private balance;
    constructor() {
        owner = msg.sender;
    }
    modifier isOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    modifier limitAmount(uint _amount, uint MAX_LIMIT) {
        if (_amount > MAX_LIMIT) {
            revert("_amount is too large");
        }
        _;
    }

    function getBalance() public /*isOwner*/ view isOwner returns (uint) {
        return balance;
    }
    // 自定义错误
    error MAX_MOUNT (uint _amount);
    function setBalance(uint _amount) public isOwner limitAmount(_amount, 100) {
        if (_amount > 50) {
            revert MAX_MOUNT(_amount); // 自定义错误之前必须有 revert
        }
        balance = _amount;
    }
}
