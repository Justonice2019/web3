// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Target {
    address public sender;
    uint public value;
    receive () external payable {}
    function setValue(uint _value) external payable {
        sender = msg.sender;
        value = _value;
    }

    function getValue() public view returns (uint) {
        return value;
    }
}

contract caller {
    function callSetValue(address target) external payable {
        // 使用call调用setValue函数，并发送以太币
        // abi.encodeWithSignature编码函数签名和参数
        (bool success,) = target.call{value: msg.value}(
            abi.encodeWithSignature("setValue(uint256)", msg.value)
        );

        // 必须检查返回值，call失败不会自动revert
        require(success, "Call failed");
    }



    function callGetValue(address target) external returns (uint) {
        (bool success, bytes memory data) = target.call(abi.encodeWithSignature("getValue()"));
        require(success, "Call failed");
        return abi.decode(data, (uint));
    }

    // 使用call发送以太币（不调用函数）
    function sendEther(address payable recipient) external payable {
        // 直接向地址发送以太币，不调用任何函数
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Ether transfer failed");
    }

}