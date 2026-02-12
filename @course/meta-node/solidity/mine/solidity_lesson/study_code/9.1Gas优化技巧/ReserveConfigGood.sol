// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReserveConfigGood {
    uint256 public data;

    // 位段定义
    uint256 private constant LTV_MASK = 0xFFFF;

    /**
 * @notice 设置LTV
     * @param ltv 贷款价值比（0-65535）
     */
    function setLTV(uint256 ltv) external {
        // 清除旧的LTV值
        data = data & ~LTV_MASK;
        // 设置新的LTV值
        data = data | (ltv & LTV_MASK);
    }

    /**
     * @notice 获取LTV
     */
    function getLTV() external view returns (uint256) {
        return data & LTV_MASK;
    }
}