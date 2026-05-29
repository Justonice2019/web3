// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SlotConflictExampleProxy {
    address public implementation;
    address public admin;

    constructor(address _implementation, address _admin) {
        implementation = _implementation;
        admin = _admin;
    }

    function upgradeTo(address newImpl) external {
        require(msg.sender == admin, "not admin");
        implementation = newImpl;
    }

    fallback() external {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}

contract SlotConflictExampleImpl {
    address public owner;   // 槽位0 ← 和 implementation 冲突！
    uint256 public count;   // 槽位1 ← 和 admin 冲突！

    function init(address _owner) external {
        owner = _owner;
    }

    function add() external virtual    {
        require(msg.sender == owner, "not owner");
        count++;
    }
}
contract SlotConflictExampleImplV2 is SlotConflictExampleImpl {
    function add() external override  {
        require(msg.sender == owner, "not owner");
        count += 2;
    }
}

contract SlotConflictExampleFixedProxy {
    // EIP-1967 定义的存储槽（天文数字，永远不会冲突）
    bytes32 constant IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 constant ADMIN_SLOT =
    0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    constructor(address _implementation, address _admin) {
        _setImplementation(_implementation);
        _setAdmin(_admin);
    }

    function _setImplementation(address newImpl) private {
        assembly {
            sstore(IMPLEMENTATION_SLOT, newImpl)
        }
    }

    function _setAdmin(address newAdmin) private {
        assembly {
            sstore(ADMIN_SLOT, newAdmin)
        }
    }

    function upgradeTo(address newImpl) external {
        require(msg.sender == _getAdmin(), "not admin");
        _setImplementation(newImpl);
    }

    function _getImplementation() private view returns (address impl) {
        assembly {
            impl := sload(IMPLEMENTATION_SLOT)
        }
    }

    function _getAdmin() private view returns (address adm) {
        assembly {
            adm := sload(ADMIN_SLOT)
        }
    }

    // 方便查看（可选）
    function getImplementation() external view returns (address) {
        return _getImplementation();
    }

    function getAdmin() external view returns (address) {
        return _getAdmin();
    }

    fallback() external {
        address impl = _getImplementation();
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}