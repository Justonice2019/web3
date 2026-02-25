// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
contract OwnerExample is Ownable {
    address public myOwner;

    constructor () Ownable(msg.sender) {
        myOwner = msg.sender;
    }

    modifier MyOwner() {
        require(msg.sender == myOwner, "not ownable");
        _;
    }

    mapping (address => uint) public balances;

    function deposit () public payable MyOwner {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public onlyOwner {
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed");
    }
}