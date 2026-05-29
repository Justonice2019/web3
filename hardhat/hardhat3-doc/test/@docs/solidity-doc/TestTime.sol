// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Utils.sol";

using Utils for uint256;

contract TestBlock {

    // 时间
    function getTime() public {
        emit Utils.LogUint256(1 days); // 86400 (单位秒 24 * 60 * 60 )
    }

}