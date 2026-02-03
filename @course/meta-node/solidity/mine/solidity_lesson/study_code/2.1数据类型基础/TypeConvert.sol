// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TypeConvert {
    function explicitConvert() public pure returns (uint8) {
        uint256 big = 300;
        uint8 small = uint8(big);  // 需要显式转换
        // 警告：300转为uint8会溢出！
        // 结果：44（300 % 256 = 44）
        return small; // 44
    }

    // 安全的类型转换
    function safeConvertToUint8 (uint256 val) public pure returns (uint8) {
        require(val <= type(uint8).max, "Value too large for uint8"); // 确保值不大于uint8的最大值
        return uint8(val);
    }

    // 地址类型转换
    function toPayable (address addr) public pure returns (address payable) {
        return payable(addr);
    }

    // address转uint160
    function addressToUint(address addr) public pure returns (uint160) {
        return uint160(addr);
    }
    //  0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 520786028573371803640530888255888666801131675076 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    function conversionExample (address addr1, uint160 num, address addr2) public pure returns (address payable, address, uint160) {
        return (
            payable(addr1),
            address(num), // 因为地址是20字节 = 160位，所以只能和uint160互相转换。
            uint160(addr2)
        );
    }


}