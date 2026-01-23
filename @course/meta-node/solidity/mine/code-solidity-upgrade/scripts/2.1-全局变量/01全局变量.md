// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0 < 0.9.0;

contract GlobalVar {
    // 区块信息
    function getBlockDetails() public view returns (uint, uint, address, uint, uint, uint) {
        return (
            block.number,
            block.timestamp,
            block.coinbase,
            block.prevrandao, // block.difficulty,
            block.gaslimit,
            block.basefee
        );
    }

    // 交易信息
    function getTxInfo () public view returns (uint, address) {
        return (
            tx.gasprice,
            tx.origin
        );
    }

}
