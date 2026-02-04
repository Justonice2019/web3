// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public immutable owner;

    mapping (address => uint256) public balanceOf;
    mapping (address => uint256) public allowance;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        totalSupply = _initialSupply * 10 ** _decimals;
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;

    }
}