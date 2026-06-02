// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Example {
    uint256 public count;
    uint256 public countInitial;
    mapping(address => uint256) balanceOf;

    Info public info;

    struct Info {
        address ownerAddress;
        address contractAddress;
        uint256 timestamp;
    }

    error MaxLimit(uint256 count);

    error MinLimit(uint256 count);

    event Increment(uint delta);

    event Decrease(uint delta);

    constructor(uint256 _count) {
        count = _count;
        countInitial = _count;
        info = Info({
            ownerAddress: msg.sender,
            contractAddress: address(this),
            timestamp: block.timestamp
        });
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function addCount() public {
        uint256 delta = 1;
        count += delta;
        emit Increment(delta);
    }

    function addCount(uint256 delta) public {
        require(delta > 0, "delta must be more than 0");
        if(delta > 5) {
            revert MaxLimit(delta);
        }
        count += delta;
        emit Increment(delta);
    }

    function minusCount() public {
        uint256 delta = 1;
        require(count > delta, "count insufficient");
        count -= delta;
        emit Decrease(delta);
    }

    function minusCount(uint256 delta) public {
        require(delta > 0, "delta must be more than 0");
        require(count > delta, "count insufficient");
        if(delta > 5) {
            revert MinLimit(delta);
        }
        count -= delta;
        emit Decrease(delta);
    }

    function depositETH () public payable {
        require(msg.value > 0, "value must be more than 0");
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw (uint256 _amount) public {
        require(balanceOf[msg.sender] >= _amount, "balance insufficient");
        balanceOf[msg.sender] -= _amount;
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success, "withdraw failed");
    }

    function getBalance(address addr) public view returns (uint256) {
        require(addr != address(0), "addr can not be 0");
        return balanceOf[addr];
    }

}