// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Target {
    address public sender;
    uint public value;

    function setValue(uint _value) external payable  {
        sender = msg.sender;
        value = _value;
    }

    function getValue() public view returns (uint) {
        return value;
    }
}

contract caller {
   function callSetValue(address target, uint256 newValue) external payable {
        // 使用call调用setValue函数，并发送以太币
        // abi.encodeWithSignature编码函数签名和参数
        (bool success, bytes memory data) = target.call{value: msg.value}(
            abi.encodeWithSignature("setValue(uint256)", newValue)
        );
        
        // 必须检查返回值，call失败不会自动revert
        require(success, "Call failed");
    }

}