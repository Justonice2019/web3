// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Animal {
    // 抽象函数：只有声明，没有实现
    function makeSound() public virtual returns (string memory);

    // 普通函数：可以有实现
    function sleep() public pure returns (string memory) {
        return "Zzz...";
    }

    // 可以有状态变量
    uint256 public age;
}

// 实现抽象合约
contract Dog is Animal {
    // 必须实现makeSound
    function makeSound() public pure override returns (string memory) {
        return "Woof!";
    }
}

contract Cat is Animal {
    function makeSound() public pure override returns (string memory) {
        return "Meow!";
    }
}