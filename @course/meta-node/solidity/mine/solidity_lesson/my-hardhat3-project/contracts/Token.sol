// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 * @title Token
 * @dev 一个简单的代币合约，用于演示多合约系统部署
 * @notice 这个合约实现了基础的转账功能
 */
contract Token {
    /**
     * @dev 账户余额映射
     * @notice 记录每个地址的代币余额
     */
    mapping(address => uint256) public balanceOf;

    address public owner;

    uint256 public supply;

    /**
     * @dev 构造函数
     * @notice 部署时给部署者分配初始代币
     */
    constructor(uint256 _supply) {

        owner = msg.sender;
        balanceOf[owner] = _supply;
        supply = _supply;
    }

    /**
     * @dev 转账函数
     * @param to 接收者地址
     * @param amount 转账数量
     * @notice 从调用者账户向接收者账户转账
     */
    function transfer(address to, uint256 amount) public {
        require(balanceOf[owner] >= amount, "Insufficient balance");
        balanceOf[owner] -= amount;
        balanceOf[to] += amount;
    }

    function getBalance() public view returns (uint256) {
        return balanceOf[owner];
    }
}
