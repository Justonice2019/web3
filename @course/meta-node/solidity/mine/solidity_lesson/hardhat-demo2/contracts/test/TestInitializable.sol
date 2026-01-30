// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SimpleUpgradeable is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;
    string public message;
    address public creator;
    
    // 使用 initializer 修饰符替代构造函数
    function initialize(uint256 _initialValue, string memory _initialMessage) public initializer {
        // 初始化父合约
        __Ownable_init(creator);
        __UUPSUpgradeable_init();
        
        // 设置初始值
        value = _initialValue;
        message = _initialMessage;
        creator = msg.sender;
    }
    
    function setValue(uint256 _newValue) public {
        value = _newValue;
    }
    
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        // 只有所有者可以升级合约
    }
}