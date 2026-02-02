// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ABI {
    // 加密
    function encodeData(
        string memory name,
        uint8 age
    ) public pure returns (bytes memory, bytes memory) {
        return (abi.encode(name, age), abi.encodePacked(name, age));
    }
    // 解码
    function decodeData(
        bytes memory data
    ) public pure returns (string memory, uint8) {
        return abi.decode(data, (string, uint8));
    }

    // 获取当前函数的签名
    function getSelector() public pure returns (bytes4) {
        return msg.sig;
    }

    // 获取当前函数的签名 每个函数的不一样
    function getSelector2() public pure returns (bytes4) {
        return msg.sig;
    }

    // 计算函数选择器
    function computeSelector(string memory func) public pure returns (bytes4) {
        return bytes4(keccak256(bytes(func)));
    }

    function transfer(
        address addr,
        uint256 amount
    ) public pure returns (bytes memory) {
        return msg.data; // 请无视 这个警告 这不是报错
        // 0xa9059cbb0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000000000064
    }

    function encodeFunctionCall() public pure returns (bytes memory) {
        return
            abi.encodeWithSignature(
                "transfer(address addr,uint256 amount)",
                0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
                100
            );
        // 0x38e926d40000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000000000064
    }

    // 哈希运算
    function hashFunctions(
        string memory input
    ) public pure returns (bytes32, bytes32, bytes32) {
        bytes memory data = abi.encodePacked(input);
        return (keccak256(data), sha256(data), ripemd160(data));
    }

    // 数学运算
    function moduarMath(
        uint256 x,
        uint256 y,
        uint256 m
    ) public pure returns (uint256, uint256) {
        return (
            addmod(x, y, m),
            mulmod(x, y, m)
        );
    }
}
