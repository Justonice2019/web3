// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MappingType {
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