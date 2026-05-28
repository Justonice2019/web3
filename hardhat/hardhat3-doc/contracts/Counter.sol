// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  uint public x;

  event Increment(uint by);

  error TooLarge(uint256 value);

  constructor (uint _x) {
    x = _x;
  }


  function inc() public {
    x++;
    emit Increment(1);
  }

  function getX() public view returns (uint) {
    return x;
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    if (by > 100) {
      revert TooLarge(by);
    }
    x += by;
    emit Increment(by);
  }
}
