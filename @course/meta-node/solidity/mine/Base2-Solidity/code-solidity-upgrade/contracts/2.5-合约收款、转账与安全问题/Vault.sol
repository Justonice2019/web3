// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// 收款和提款合约
contract Vault {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable { }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        (bool success,) = payable(owner).call{value: address(this).balance}("");
        require(success, "withdraw failed");
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

}

contract VulnerableVault {
    mapping(address => uint256) public balance;

    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint256) {
        return balance[msg.sender];
    }

    function withdraw() external {
        // 1. 获取用户的存款余额
        uint256 amount = balance[msg.sender];

        require(amount > 0, "No balance to withdraw");

        balance[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");

        require(success, "Transfer failed");
    }

    // 获取合约总余额
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
