// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // 1. 定义枚举
    enum Vote { Yes, No, Abstain }

    // 2. 状态变量
    mapping(address => Vote) public votes;
    mapping(address => bool) public hasVoted;
    uint public yesCount;
    uint public noCount;
    uint public abstainCount;

    // 3. 投票函数
    function vote(Vote _vote) public {
        require(!hasVoted[msg.sender], "You have already voted!");
        hasVoted[msg.sender] = true;
        votes[msg.sender] = _vote;
        if (_vote == Vote.Yes) {
            yesCount ++;
        } else if(_vote == Vote.No) {
            noCount ++;
        } else if(_vote == Vote.Abstain) {
            abstainCount ++;
        }
        // TODO: 实现投票逻辑
        // - 检查是否已投票
        // - 记录投票
        // - 更新计数
    }

    // 4. 查询函数
    function getResults() public view returns (uint, uint, uint) {
        return (yesCount, noCount, abstainCount);
    }

    function getMyVote() public view returns (Vote) {
        require(hasVoted[msg.sender], "You haven't voted");
        return votes[msg.sender];
    }
}