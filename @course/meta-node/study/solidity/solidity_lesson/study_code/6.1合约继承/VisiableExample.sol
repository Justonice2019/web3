// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/*
public：最开放，子合约和外部都能访问;
internal：只有子合约能访问，外部不能
private：最严格，连子合约都不能访问;
external：外部可以调用，但是不能在合约内部直接调用

运行环境:
    合约本体
    子合约
    合约外部
public:
    合约本体
    子合约
    合约外部
internal：
    合约本体
    子合约
private：
    合约本体
external：
    合约外部
    (注意: 只有函数才有 external 修饰符; 子合约可以继承下来, 可以在外部直接调用)
 */
contract Parent {
    uint256 public publicVar = 1;       // 子合约可访问
    uint256 internal internalVar = 2;   // 子合约可访问
    uint256 private privateVar = 3;     // 子合约不可访问
//    uint256 external externalVar = 4; // 属性是不可以设置 external 的

    function publicFunc() public pure returns (string memory) {
        return "public";
    }

    function internalFunc() internal pure returns (string memory) {
        return "internal";
    }

    function privateFunc() private pure returns (string memory) {
        return "private";
    }
    function externalFunc() external pure returns (string memory) { // 被继承下来后, 可以在 外部调用, 比如 remix 可以直接调用
        return "external";
    }
}

contract Child is Parent {
    function test() public view returns (uint256, uint256) {
        // 可以访问public和internal
        uint256 a = publicVar;
        uint256 b = internalVar;
        // uint256 c = privateVar;  // 编译错误！无法访问private
        // uint256 d = externalVar; // 子合约不可访问, 但是能继承下来在外部比如 remix可以直接获取到

        publicFunc();    // 可以调用
        internalFunc();  // 可以调用
        // privateFunc();  // 编译错误！无法访问private
        // externalFunc(); // 不可以调用, 但是能继承下来在外部比如 remix可以直接调用.

        return (a, b);
    }
}
