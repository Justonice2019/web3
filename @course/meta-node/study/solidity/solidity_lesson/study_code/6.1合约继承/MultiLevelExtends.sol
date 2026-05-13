// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract A {
    function foo() public virtual returns (string memory) {
        return "A";
    }
}

contract B is A {
    function foo() public virtual override returns (string memory) {
        return string.concat("B->", super.foo());
    }
}

contract C is A {
    function foo() public virtual override returns (string memory) {
        return string.concat("C->", super.foo());
    }
}

contract D is B, C {
    function foo() public override(B, C) returns (string memory) {
        return string.concat("D->", super.foo());
    }
}