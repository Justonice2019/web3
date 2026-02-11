// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint private count = 0;
    address private immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function increment() internal {
        require(msg.sender == owner, "Not owner");
        count++;
    }
}

contract Counters {
    Counter[] public counters;

    function createCounter() external {
        counters.push(new Counter());
    }

    function getCounters() public view returns (Counter[] memory) {
        return counters;
    }
}