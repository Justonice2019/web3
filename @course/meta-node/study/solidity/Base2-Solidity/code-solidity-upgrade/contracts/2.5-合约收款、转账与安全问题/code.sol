// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0 < 0.9.0;

contract MyContract {
    function funcName() public payable  {

    }

    event Received(address sender, uint amount);

    receive() external payable {
        emit Received(msg.sender, msg.value);
     }
}

contract GetMsg {
    function getSig() external pure returns (bytes4) {
        return msg.sig;
    }
}