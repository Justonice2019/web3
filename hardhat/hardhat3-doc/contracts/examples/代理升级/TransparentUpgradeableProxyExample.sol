// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {TransparentUpgradeableProxy as OpenZeppelinTransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin as OpenZeppelinProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

contract ImplV1Example is Initializable, ContextUpgradeable {
    uint256 public count;

    uint256 public delta = 1;

    function addCount () public virtual  {
        count ++;
    }

    function initialize(uint256 _delta) public initializer {
        __Context_init();
        delta = _delta;
    }
}

contract ImplV2Example is ImplV1Example {
    uint256 public version;
    function addCount () public override  {
        count = count + delta + 1;
    }

    function minusCount () public  {
        count --;
    }

    function initializeV2(uint256 _delta, uint256 _version) public reinitializer(2) {
        delta = _delta;
        version = _version;
    }
}

contract ProxyExample is OpenZeppelinTransparentUpgradeableProxy {
    constructor(address _logic, address initialOwner, bytes memory _data) OpenZeppelinTransparentUpgradeableProxy(_logic, initialOwner, _data) {

    }
}

contract ProxyAdminExample is OpenZeppelinProxyAdmin {
    constructor(address initialOwner) OpenZeppelinProxyAdmin (initialOwner) {}
}