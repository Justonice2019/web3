// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICounter {
    // 所有函数必须是external
    function getCount() external view returns (uint256);

    function increment() external;

    function decrement() external;

    // 可以定义事件
    event CountChanged(uint256 newCount);
}

contract Counter is ICounter {
    uint256 private count;

    function getCount() public view override returns (uint256) {
        return count;
    }

    //     function increment() internal  override { // err
    //     function increment() private override { // err
    function increment() external override {
        count++;
        emit CountChanged(count);
    }

    function decrement() external override {
        count--;
        emit CountChanged(count);
    }
}