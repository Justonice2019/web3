// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Victim {
    mapping(address => uint) public balances;
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    function withdraw (uint amount) public {
        uint balance = balances[msg.sender];
        require(balance > 0, "balance is not");
        (bool result,) = msg.sender.call{value: amount}("");
        require(result, "call failed");
        balances[msg.sender] -= amount;
    }

    function getBalanceByAddress (address addr) public view returns (uint) {
        return balances[addr];
    }

}

contract Attacker {

}