// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletError {
    mapping (address => uint256) public balances; // Mapping from address to balance

    function deposit(uint256 amount) public {
        balances[msg.sender] += amount;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "not enough");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount); // err 如果你的 deposit 函数没有真正接收ETH，那么 balances 只是记录了一个数字，合约里没有真正的ETH可以转账！
    }
}

contract WalletRight {
    // Storage - 需要永久保存
    mapping(address => uint256) public balances;
    
    function deposit() external payable {
        // 修改storage状态
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        // 读取和修改storage
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}