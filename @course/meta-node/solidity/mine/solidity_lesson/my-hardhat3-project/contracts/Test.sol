// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Test {
  bool public flag;
  uint256 public count;
  uint256 public integer = 10;
  string public str = "Hello world";
  bool public boolean = true;
  address public addr = msg.sender;
  uint256[] public arr;

  event Increase (uint256 indexed delta);

  event Decrease (uint256 indexed delta);

  function setFlag(bool _flag) public {
    flag = _flag;
  }
  function getFlag() public view returns (bool) {
    return flag;
  }

  function getAtIndex(uint256 index) public view returns (uint256) {
    return arr[index];
  }
  function getArr() public view returns (uint256[] memory) {
    return arr;
  }

  function pushToArr(uint256 val) public {
    arr.push(val);
  }

  function inc() public {
    count += 2;
    emit Increase(2);
  }
  function dec() public {
    count --;
    emit Decrease(1);
  }

  function incBy(uint256 val) public {
    require(val < 100);
    require(val > 0, "incBy: increment should be positive");
    count += val;
  }

}
