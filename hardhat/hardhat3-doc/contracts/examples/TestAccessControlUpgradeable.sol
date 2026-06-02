// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestAccessControlUpgradeable is Initializable, AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE2 = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    function initialize (address admin) public initializer {
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE2, admin);
    }

    function doOperatorWork() external view onlyRole(OPERATOR_ROLE) returns (string memory) {
        return "Operator work done";
    }

    // 添加操作员（只有管理员可以）
    function addOperator(address operator) external onlyRole(ADMIN_ROLE2) {
        grantRole(OPERATOR_ROLE, operator);
    }

    
}
