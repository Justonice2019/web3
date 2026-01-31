// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Good {
    uint8 a;
    uint8 b;
    uint256 c;
}


contract Bad {
    uint8 a;
    uint256 c;
    uint8 b;
}