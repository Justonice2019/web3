// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CallOptimization {
    // ❌ 外部函数：昂贵
    function calculateExternal(uint256 a, uint256 b) 
        external pure returns (uint256) {
        return a * b + 100;
    }
    
    // ✅ 内部函数：便宜
    function calculateInternal(uint256 a, uint256 b) 
        internal pure returns (uint256) {
        return a * b + 100;
    }
    
    // ❌ 低效：在合约内部调用外部函数
    function processUnoptimized(uint256 x) external view returns (uint256) {
        // this.calculateExternal() 是外部调用！
        return this.calculateExternal(x, 2);  // ~700 gas
    }
    
    // ✅ 高效：调用内部函数
    function processOptimized(uint256 x) external pure returns (uint256) {
        return calculateInternal(x, 2);  // ~20 gas
    }
    // 节省：~680 gas (97%)
}