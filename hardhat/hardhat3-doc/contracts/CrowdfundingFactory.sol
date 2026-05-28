// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CrowdfundingCampaign.sol";

contract CrowdfundingFactory {
    CrowdfundingCampaign[] public campaigns;

    mapping(address => uint256[]) public userCampaigns;

    event CampaignCreated(
        address indexed creator,
        address indexed campaign,
        string name,
        uint256 goal,
        uint256 deadline
    );

    function createCampaign(
        string memory _name,
        uint256 _goal,
        uint256 _durationInDays
    ) external returns (address) {
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(
            msg.sender,
            _name,
            _goal,
            _durationInDays
        );

        campaigns.push(campaign);
        userCampaigns[msg.sender].push(campaigns.length - 1);

        // 触发活动创建事件
        emit CampaignCreated(
            msg.sender,
            address(campaign),
            _name,
            _goal,
            block.timestamp + (_durationInDays * 1 days)
        );

        return address(campaign);
    }

    function getCampaigns() external view returns (address[] memory) {
        address[] memory campaignAddresses = new address[](campaigns.length);
        // 遍历所有活动，将地址存入数组
        for (uint256 i = 0; i < campaigns.length; i++) {
            campaignAddresses[i] = address(campaigns[i]);
        }
        return campaignAddresses;
    }

    function getUserCampaigns(
        address user
    ) external view returns (address[] memory) {
        uint256[] memory indices = userCampaigns[user];
        address[] memory userCampaignAddresses = new address[](indices.length);
        for (uint256 i = 0; i < indices.length; i++) {
            userCampaignAddresses[i] = address(campaigns[indices[i]]);
        }
        return userCampaignAddresses;
    }

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }
}
