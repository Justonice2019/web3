// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimeLock {
    mapping (address => uint256) balances;
    mapping (address => uint256) unlockTimes;

    modifier onlyOneHourLater () {
        require(block.timestamp > unlockTimes[msg.sender], "you can withdraw after one hour");
        _;
    }

    function deposit () public payable {
        unlockTimes[msg.sender] = block.timestamp + 1 hours;
        balances[msg.sender] = msg.value;
    }

    function withdraw(uint256 amount) public onlyOneHourLater {
        require(amount > 0, "invalid amount");
        require(amount <= balances[msg.sender], "balance insufficient");
        (bool success, ) = msg.sender.call{value: amount}(""); // send the money back}
        require(success, "withdraw failed");
    }

    function getBalance(address addr) public view returns (uint256){
        return balances[addr];
    }
}