// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UnsafeToken {
    mapping (address addr => uint256 amount) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function witdhdraw(uint256 amount) public {
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
    }
    //
}