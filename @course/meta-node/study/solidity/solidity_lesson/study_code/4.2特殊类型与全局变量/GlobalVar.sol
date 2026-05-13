// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GlobalVar {
    function getMsgInfo()
        public
        payable
        returns (address, uint, bytes memory, bytes4)
    {
        return (msg.sender, msg.value, msg.data, msg.sig);
    }

    function getBloackInfo()
        public
        view
        returns (uint, uint, uint, address payable, bytes32)
    {
        return (
            block.timestamp,
            block.number,
            block.gaslimit,
            block.coinbase,
            blockhash(block.number)
        );
    }

    function getTxInfo() public view returns (address, uint) {
        return (tx.origin, tx.gasprice);
    }

    function getOtherFuncInfo() public view returns (uint, bytes32, bytes memory) {
        return (gasleft(), keccak256("hello"), abi.encode("world"));
    }
}
