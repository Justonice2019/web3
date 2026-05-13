// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Par {
    function foo(string memory str1) public pure virtual returns (string memory) {
        return string.concat("Par->", str1);
    }
}

contract Son is Par {
    function foo(string memory str1) public pure override returns (string memory) {
        return string.concat("Son->", str1);
    }
    function foo(string memory str1, string memory str2) public pure returns (string memory) {
        return string.concat(str1, str2);
    }
}
