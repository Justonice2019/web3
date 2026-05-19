// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/utils/Strings.sol";

contract CrowdfundingCampaign {
    enum State {
        Preparing,
        Active,
        Success,
        Failed,
        Closed
    }

    address public owner;
    string public name;
    uint256 public goal;
    uint256 public deadline;
    State public state;
    address[] public contributors;
    mapping(address => uint256) public contributions;
    uint256 public totalRaised;

    event StateChanged(State indexed oldState, State indexed newState);
    event Contribution(address indexed sender, uint256 indexed value);
    event Withdraw(address indexed owner, uint256 indexed amount);
    event Refund(address indexed sender, uint256 indexed amount);

    constructor(
        address _owner,
        string memory _name,
        uint256 _goal,
        uint256 _durationInDays
    ) {
        require(_owner != address(0), "CrowdfundingCampaign: invalid owner");
        require(
            bytes(_name).length > 0,
            "CrowdfundingCampaign: name cannot be empty"
        );
        require(_goal > 0, "CrowdfundingCampaign: goal must be positive");
        require(
            _durationInDays > 0 && _durationInDays <= 90,
            "CrowdfundingCampaign: invalid duration"
        );

        owner = _owner;
        name = _name;
        goal = _goal;
        deadline = block.timestamp + _durationInDays * 1 days;
        state = State.Preparing;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "CrowdfundingCampaign: caller is not the owner"
        );
        _;
    }
    modifier inState(State _state) {
        require(state == _state, "CrowdfundingCampaign: invalid state");
        _;
    }

    modifier notExpired() {
        require(
            block.timestamp < deadline,
            "CrowdfundingCampaign: campaign has expired"
        );
        _;
    }

    function start() external onlyOwner inState(State.Preparing) {
        state = State.Active;
        emit StateChanged(State.Preparing, State.Active);
    }

    function contribute() external payable inState(State.Active) notExpired {
        require(msg.value > 0, "value can not be zero");
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;

        totalRaised += msg.value;
        emit Contribution(msg.sender, msg.value);
    }

    function finalize() external inState(State.Active) {
        require(
            block.timestamp > deadline,
            "CrowdfundingCampaign: campaign not ended"
        );
        State oldState = state;
        if (totalRaised >= goal) {
            state = State.Success;
        } else {
            state = State.Failed;
        }
        emit StateChanged(oldState, state);
    }

    function withdraw() external payable onlyOwner inState(State.Success) {
        state = State.Closed;
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "transaction failed");

        emit Withdraw(msg.sender, amount);
        emit StateChanged(State.Success, state);
    }

    function refund() external payable inState(State.Failed) {
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "insufficient amount");

        contributions[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "transaction failed");

        emit Refund(msg.sender, amount);
    }

    function getContributors() external view returns (address[] memory) {
        return contributors;
    }

    function getContributorCount() external view returns (uint256) {
        return contributors.length;
    }
    function isActive() external view returns (bool) {
        return state == State.Active;
    }
    function getProgress() external view returns (uint256) {
        // 如果目标为0，返回0
        if (goal == 0) return 0;
        // 计算进度百分比：已筹集金额 * 100 / 目标金额
        uint256 progress = (totalRaised * 100) / goal;
        // 如果超过100%，则返回100
        return progress > 100 ? 100 : progress;
    }
}
