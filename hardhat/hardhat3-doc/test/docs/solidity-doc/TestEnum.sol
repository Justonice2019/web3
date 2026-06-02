// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Utils.sol";

using Utils for uint256;

contract TestEnum {
    enum State {
        Preparing,
        Active,
        Success,
        Failed,
        Closed
    }

    function getEnum() public {
        // emit Utils.LogUint256(State.Preparing); // err
        emit Utils.LogUint256(uint256(State.Preparing)); // 0
    }
}
