// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract TestAddress {
    address public myAddress;

    address public caller = msg.sender;

    function compareAddress(
        address addr1,
        address addr2
    ) public pure returns (bool) {
        return addr1 == addr2;
    }

    function toBytes(address addr) public pure returns (bytes memory) {
        return abi.encodePacked(addr);
    }

    // 获取地址的余额
    function getBalance(address addr) public view returns (uint256) {
        return addr.balance;
    }

    // 向地址转账
    function sendEther(address payable recipient) public payable {
        recipient.transfer(msg.value);
    }

    // 调用地址的代码（低级别调用）
    function callContract(
        address addr,
        bytes memory data
    ) public returns (bool, bytes memory) {
        (bool success, bytes memory result) = addr.call(data);
        return (success, result);
    }
}
