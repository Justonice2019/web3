// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// 目标合约
contract TargetContract {
    uint256 public value = 100;

    // view函数：可以读取状态
    function getValue() external view returns (uint256) {
        return value;
    }

    // 修改状态的函数
    function setValue(uint256 _value) external {
        value = _value;
    }
}

// 调用者合约：使用staticcall
contract StaticcallDemo {
    // 使用staticcall调用view函数（安全）
    function safeGetValue(address target) external view returns (uint256) {
        (bool success, bytes memory returnData) = target.staticcall(
            abi.encodeWithSignature("getValue()")
        );

        require(success, "Staticcall failed");

        // 解码返回值
        uint256 value = abi.decode(returnData, (uint256));
        return value;
    }

    // 尝试使用staticcall调用修改状态的函数（会失败）
    function unsafeSetValue(address target, uint256 newValue) external {
        // 这个调用会失败，因为setValue会修改状态
        (bool success, ) = target.staticcall(
            abi.encodeWithSignature("setValue(uint256)", newValue)
        );

        // success会是false，因为staticcall不允许修改状态
        require(success, "Staticcall failed: cannot modify state");
    }
}