// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RefactoringPattern {
    uint256 public value;
    
    // 设计模式：提供internal版本用于内部调用
    function _setValue(uint256 newValue) internal {
        require(newValue > 0, "Invalid value");
        value = newValue;
    }
    
    // External版本供外部调用
    function setValue(uint256 newValue) external {
        _setValue(newValue);
    }
    
    // 其他函数可以高效调用internal版本
    function doubleValue() external {
        _setValue(value * 2);  // 内部调用，便宜
    }
    
    function resetValue() external {
        _setValue(1);  // 内部调用，便宜
    }
}