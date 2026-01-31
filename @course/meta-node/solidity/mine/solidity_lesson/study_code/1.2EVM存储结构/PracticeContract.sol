// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PracticeContract {
    uint256[] public numbers;
    address public immutable admin;
    uint256 public constant multiplier = 2;
    
    constructor() {
        admin = msg.sender;
    }

    function batchProcess(
        uint256[] calldata inputs
    ) external {
        require(msg.sender == admin);
        uint256 len = inputs.length;
        uint256[] memory tmpArr  = new uint256[](len);

        for (uint i = 0; i < len; i++) {
            tmpArr[i] = inputs[i] * multiplier;
        }

        for (uint i = 0; i < tmpArr.length; i++) {
            numbers.push(tmpArr[i]);
        }
    }
    
    function getSum() external view returns (uint256) {
        require(msg.sender == admin);
        
        uint256 sum = 0;
        uint256[] memory _numbers = numbers;
        uint256 len = _numbers.length;
        for (uint i = 0; i < len; i++) {
            sum += _numbers[i];
        }
        return sum;
    }
}