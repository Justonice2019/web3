// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercise {
    function safeConvertToUint8(uint256 value) public pure returns (uint8) {
        // TODO: 添加范围检查
        // 如果value大于255，应该revert
        if (value > type(uint8).max) {
            revert("value is too large");
        }
        return uint8(value);
    }

    function compareStrings(
        string memory a,
        string memory b
    ) public pure returns (bool) {
        // TODO: 实现字符串比较
        // 提示：使用keccak256
        // return keccak256(bytes(a)) == keccak256(bytes(b));
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    function getZeroAddress() public pure returns (address) {
        return address(0);
    }
    function isZeroAddress(address addr) public pure returns (bool) {
        // TODO: 检查是否为零地址
        return addr == address(0);
    }
}
