// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestPausableUpgradeable is Initializable, PausableUpgradeable {
    // constructor () {
    //     _disableInitializers();
    // }

    function initialize() public initializer {
        __Pausable_init();
    }

    function doSomething() external view whenNotPaused returns (string memory) {
        return "Working";
    }

    // 暂停功能（需要有权限控制，这里用 external 方便测试）
    function pauseContract() external {
        _pause();
    }

    // 恢复功能
    function unpauseContract() external {
        _unpause();
    }
}