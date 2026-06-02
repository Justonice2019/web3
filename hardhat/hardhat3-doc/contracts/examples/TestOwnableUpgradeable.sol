// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestOwnableUpgradeable is Initializable, OwnableUpgradeable {

    uint256 public value;

//    constructor() {
//        _disableInitializers();
//    }

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
    }

    function setValue(uint256 _value) external onlyOwner {
        value = _value;
    }
}
