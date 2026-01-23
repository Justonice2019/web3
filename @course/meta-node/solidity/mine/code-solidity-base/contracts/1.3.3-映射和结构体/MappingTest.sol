// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0 < 0.9.0;

contract MappingTest {
    // mapping (address => uint256) public balances; // 和下面等效
    mapping (address account => uint256 amount) public balances;

    function setBalance (address _key, uint _value) public {
        balances[_key] = _value;
    }
    function getBalance (address _key) public view returns (uint256) {
        return balances[_key];
    }

    function testFunc1 () public {
        // mapping (address account => uint256 amount) storage balances; // 不能在函数里面声明
    }


    // 1.3 多级映射（嵌套映射）
    mapping (address => mapping(string currency => uint256 amount)) public userBalances;
    function setUserBalance (string memory currency, uint256 amount) public {
        userBalances[msg.sender][currency] = amount;
    }
    function getUserBalance (address user, string memory currency) public view returns (uint256) {
        return userBalances[user][currency];
    }
    // 不可以删除 mapping
    function delUserBalance (address user, string memory currency) public {
        delete userBalances[user][currency];
    }
    
}