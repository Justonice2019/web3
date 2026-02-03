// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddressVsAddressPayable {
    mapping(address => uint) private balances;
    // 1. 可以接收 remix 的 Transact 转账
    receive() external payable {
        // balances[msg.sender] += msg.value; // 这个会导致别的合约转进来导致报错, 后续再研究吧
    }
    fallback() external payable {}

    // 接收 deposit 函数调用存入的金额
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // 查看用户余额
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    // 查看合约ETH余额
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    // address → address payable
    function toPayable(address addr) public pure returns (address payable) {
        return payable(addr);
    }

    // address payable → address（自动转换）
    function toNormal(address payable addr) public pure returns (address) {
        return addr;  // 自动转换，无需显式转换
    }

    // 实际使用
    function sendEther(address recipient, uint amount) public {
        address payable payableRecipient = payable(recipient);
        payableRecipient.transfer(amount);
    }

    function getAllBalance(address account) public view returns (uint, uint, uint) {
        return (
            address(this).balance,
            msg.sender.balance,
            account.balance
        );
    }
}

contract Other {
    receive() external payable {}

    fallback() external payable {}

    function transferETH(address payable recipient, uint amount) public {
        recipient.transfer(amount); // 如果失败，整个交易回退
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
