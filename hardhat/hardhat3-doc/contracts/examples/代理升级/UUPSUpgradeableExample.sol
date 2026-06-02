// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UUPSUpgradeableExampleV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public count;
    uint256 public delta = 1;

    function initialize(uint256 _delta) public initializer {
        __Ownable_init(_msgSender());
        delta = _delta;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner  {

    }
    function addCount () public virtual  {
        count ++;
    }
}

contract UUPSUpgradeableExampleV2 is UUPSUpgradeableExampleV1 {
    uint256 public version;

    constructor() {
        _disableInitializers();
    }

    function reinitializeV2(uint256 _version) public reinitializer(2) {
        version = _version;
    }

    // 重写 addCount，改变行为
    function addCount() public override {
           count = count + delta + 1;
    }

    // 新增功能
    function minusCount() public onlyOwner {
        require(count >= delta, "Count cannot be negative");
        count -= delta;
    }
}