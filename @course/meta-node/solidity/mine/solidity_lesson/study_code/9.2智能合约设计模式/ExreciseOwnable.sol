// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ExerciseOwnable {

    address public creator;

    string public name;

    string public symbol;

    uint public totalSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        uint decimal,
        uint _totalSupply
    ) {
        creator = msg.sender;
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
    }

    function mint() public {

    }

    function transfer() public {

    }

    function balanceOf() public returns (uint) {

    }
}