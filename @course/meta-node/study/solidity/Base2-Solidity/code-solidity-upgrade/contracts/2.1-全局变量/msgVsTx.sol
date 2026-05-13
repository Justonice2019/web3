// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Caller {
    function getMsgSender() public view returns (address) {
        return msg.sender; // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    }
    function getTxOrigin() public view returns (address) {
        return tx.origin; // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    }
}

contract Callee {
    Caller caller;

    constructor() {
        caller = new Caller();
    }

    function getCallerMsgSender() public view returns (address) {
        return caller.getMsgSender(); // 0xd9145CCE52D386f254917e481eB44e9943F39138
    }
    function getCallerTxOrigin() public view returns (address) {
        return caller.getTxOrigin(); // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    }
}
