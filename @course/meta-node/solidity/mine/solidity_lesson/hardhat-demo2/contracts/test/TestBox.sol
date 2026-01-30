// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Box {
    uint256 private _value;

    function deposit(uint256 value) public {
        _value = value;
    }

    function withdraw(uint256 value) public returns (uint256) {
        _value -= value;
        return _value;
    }
    
    function getValue() public view returns (uint256) {
        return _value;
    }
}

contract BoxProxy {
    address public implementation; // 逻辑合约地址
    address public admin; // 管理员地址
    
    // 初始化代理合约
    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }
    
    // 修改器：仅管理员可调用
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    // 委托调用到逻辑合约
    function _delegate(address _impl) internal {
        assembly {
            // 复制calldata到内存中
            calldatacopy(0, 0, calldatasize())
            
            // 使用delegatecall执行逻辑合约的代码
            // 使用当前合约的存储和msg.sender, msg.value
            let result := delegatecall(
                gas(),           // gas
                _impl,           // 目标地址（逻辑合约）
                0,               // 输入数据指针
                calldatasize(),  // 输入数据大小
                0,               // 输出数据指针
                0                // 输出数据大小
            )
            
            // 复制返回数据到内存
            returndatacopy(0, 0, returndatasize())
            
            // 根据结果决定返回还是回滚
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
    
    // 获取当前逻辑合约地址
    function _getImplAddress() public view returns (address) {
        return implementation;
    }
    
    // 升级逻辑合约（仅管理员）
    function upgrade(address newImplementation) public onlyAdmin {
        require(newImplementation != address(0), "Invalid address");
        implementation = newImplementation;
    }
    
    // 转移管理员权限（仅管理员）
    function transferAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
    
    // 回退函数：当调用代理合约中不存在的函数时触发
    fallback() external payable {
        _delegate(implementation);
    }
    
    // 接收以太币的函数
    receive() external payable {}
}

// 升级后的逻辑合约示例
contract BoxV2 {
    uint256 private _value;
    uint256 private _lastUpdated; // 新增功能：记录最后更新时间戳
    
    function deposit(uint256 value) public {
        _value = value;
        _lastUpdated = block.timestamp;
    }
    
    function withdraw(uint256 value) public returns (uint256) {
        _value -= value;
        _lastUpdated = block.timestamp;
        return _value;
    }
    
    function getValue() public view returns (uint256) {
        return _value;
    }
    
    // 新增功能：获取最后更新时间
    function getLastUpdated() public view returns (uint256) {
        return _lastUpdated;
    }
}