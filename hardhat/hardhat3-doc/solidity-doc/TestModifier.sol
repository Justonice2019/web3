// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./Utils.sol";

using Utils for uint256;

contract TestModifier {
    enum State {
        Preparing,
        Active,
        Success,
        Failed,
        Closed
    }
    address public owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "CrowdfundingCampaign: caller is not the owner"
        );
        _;
    }
    modifier inState(State _state) {
        require(
            msg.sender == owner,
            "CrowdfundingCampaign: caller is not the owner"
        );
        _;
    }
    constructor() {
        owner = msg.sender;
    }

    function start() external onlyOwner inState(State.Preparing) {}

    // 修饰符的位置无所谓
    function contribute() external payable inState(State.Active) {}

    function contribute2() payable external  inState(State.Active) {}
}
