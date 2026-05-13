// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Base {
    string public name;
    uint256 public version;

    constructor(string memory _name, uint256 _version) {
        name = _name;
        version = _version;
    }
}

contract Extended is Base {
    address public creator;
    constructor (string memory name, uint256 version) Base (name, version) {
        creator = msg.sender;
    }
    // err: 不支持这样
    // constructor (string memory name, uint256 version) {
    //     super(name, version);
    //     creator = msg.sender;
    // }
}