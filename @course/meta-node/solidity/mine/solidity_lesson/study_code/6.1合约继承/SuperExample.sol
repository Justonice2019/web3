// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Par {
    function greet() public virtual returns (string memory) {
        return "Par greeting";
    }
}

contract Son is Par {
    function greet() public override returns (string memory) {
        string memory parGreet = super.greet();
        return string .concat(parGreet);
    }
}