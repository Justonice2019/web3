// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransferExample {
    receive() external payable {}
    // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
    function transferTo(address to, uint amount) public {
        require(address(this).balance >= amount, "balance is not enough");
        payable(to).transfer(amount);
    }
    function sendTo(address payable to, uint amount) public {
        require(address(this).balance >= amount, "balance is not enough");
        bool result = to.send(amount);
        require(result, "send failed");
    }
    function callTo(address payable to, uint amount) public {
        require(address(this).balance >= amount, "balance is not enough");
        (bool result, ) = to.call{value: amount}("");
        require(result, "call failed");
    }
}
