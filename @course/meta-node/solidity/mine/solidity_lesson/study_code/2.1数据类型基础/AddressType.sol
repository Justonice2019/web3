// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddressType {
    receive() external payable {}

    fallback() external payable {}

    function getBalance(address addr) public view returns (uint) {
        // 账户和合约地址都可以
        return addr.balance;
    }

    function getCurrentContractAddress() public view returns (address) {
        return address(this);
    }

    function getCurrentContractbalance() public view returns (uint) {
        return address(this).balance;
    }

    // 检查是否为零地址
    // 0x0000000000000000000000000000000000000000
    function isZeroAddress(address addr) public pure returns (bool) {
        return addr == address(0);
    }

    function getSpecialAddresses()
        public
        view
        returns (address, address, address)
    {
        return (address(this), msg.sender, tx.origin);
    }
}

// 区分 msg.sender 和 tx.origin
contract SenderVsOriginExampleSub {
    function getSpecialAddresses()
        external
        view
        returns (address, address, address)
    {
        // 通过 SenderVsOriginExample 调用 SenderVsOriginExampleSub 的getSpecialAddresses 就会出现  msg.sender, tx.origin 不一致
        // address(this): 为 SenderVsOriginExampleSub 合约地址
        // msg.sender: SenderVsOriginExample 合约地址
        // tx.origin: 为登录账户地址
        return (address(this), msg.sender, tx.origin); 
    }
}
contract SenderVsOriginExample {
    SenderVsOriginExampleSub private immutable sub;
    constructor(address addr) {
        sub = SenderVsOriginExampleSub(addr);
    }
    function getSpecialAddresses()
        public
        view
        returns (address, address, address)
    {
        require(address(sub) != address(0), "empty sub!");
        return sub.getSpecialAddresses();
    }
}


// 转账功能
/*
方法	Gas限制	失败处理	推荐程度
transfer	2300 gas	自动回退	中等
send	2300 gas	返回false	低
call	无限制	返回false	高（配合require
*/
contract TransferExample {
    // 接收ETH的函数需要payable修饰符
    receive() external payable { }

    // transfer方法（推荐，失败会回退）
    // 试试往合约充值, 再转给别的账户
    function transferETH (address payable receiveAddr, uint256 amount) public returns (bool) {
        bool result = receiveAddr.send(amount);
        require(result, "Send Fail");
        return result;
    }

    function transferETH2 (address receiveAddr, uint256 amount) public returns (bool) {
        bool result = payable(receiveAddr).send(amount);
        require(result, "Send Fail");
        return result;
    }

    function callTransfer (address payable receiveAddr, uint256 amount) public {
        (bool success,) = receiveAddr.call{value: amount}("");
        require(success, "Transfer Fail");
    }

    function callTransferWithLimit (address payable receiveAddr, uint256 amount, uint256 gasLimit) public returns(bool) {
        (bool success,) = receiveAddr.call{value: amount, gas: gasLimit}("");
        require(success, "Transfer Fail");
        return success;
    }
}