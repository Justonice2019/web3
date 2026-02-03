// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MappingType {
    mapping(address => uint256) public balances;

    function getBalance () public view returns (uint256) {
        if (balances[msg.sender] == 0) {
            revert("address is not exsit");
        }
        return balances[msg.sender];
    }
    function setBalance (uint256 amount) public returns (uint256) {
        balances[msg.sender] = amount;
        return  balances[msg.sender];
    }

    mapping (string => uint256) public uintMap;
    mapping (string => bool) public boolMap;
    function getDefaultMappingVal () public view returns (uint256, bool) {
        return (
            uintMap["xxx"],
            boolMap["yyy"]
        );
    }

    function createMapping () public {
        // mapping ( address => uint256 ) memory  _balances; // err
        // mapping ( address => uint256 ) storage  _balances; // err
    }
}