// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// 2.1 区块信息（Block Information）
contract BlockInfo {
    function testBlockInfo()
        public
        view
        returns (uint, uint, address, uint, uint, uint)
    {
        return (
            block.number, // 当前区块的编号
            block.timestamp, // 当前区块的时间戳(Unix时间)
            block.coinbase, // 当前出块矿工的地址
            block.prevrandao, // block.difficulty // 当前区块的难度
            block.gaslimit, // 当前区块的gas限制
            block.basefee // EIP-1559之后的基本交易费
        );
    }
}

// 2.2 交易信息（Transaction Information）
// 2.3 消息信息（Message Information）
contract TxInfo {
    function testTxInfo() public view returns (uint, address) {
        return (
            tx.gasprice, // 交易的 gas 价格
            tx.origin // 交易的发起者(外部账户地址)
        );
    }
}

contract MessageInfo {
    // function getMsgDetails() public view returns (address, uint) { // TypeError: "msg.value" and "callvalue()" can only be used in payable public functions. Make the function "payable" or use an internal function to avoid this error.
    //     return (msg.sender, msg.value);
    // }

    function getMsgDetails() public payable returns (address, uint) {
        return (msg.sender, msg.value);
    }

    function getContractAddress() public view returns (address) {
        return address(this); // 0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3
    }
    function getContractBalance() public view returns (uint) {
        return address(this).balance; // 5000000000000000000
    }

    function testMessageDetails()
        public
        payable
        returns (address, uint, bytes memory, bytes4)
    {
        return (
            msg.sender, // 调用合约的账户或合约地址
            msg.value, // 调用合约时发送的 ETH 数量
            msg.data, // 交易调用时的完整数据
            msg.sig // 交易调用的函数选择器
        );
    }
}

// 2.4 以太坊环境信息（Ethereum Environment Information）
contract ENVInfo {
    function testENVInfo () public view returns (uint, uint, address, uint) {
        return (
            gasleft(), // 当前剩余的gas
            block.chainid, // 当前链的ID(EIP-1344)
            address(this), // 当前合约的地址
            address(this).balance // 当前合约的ETH余额
        );
    }
}