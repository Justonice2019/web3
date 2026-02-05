// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Parent {
    uint public value;

    function setVal(uint _value) public  {
        value = _value;
    }

    function getValue() external view returns (uint) {
        return value;
    }

    function doubleVal() external   {
        value = value * 2;
    }
}

contract Children is Parent {
    function tripleVal() public  {
        value = value * 3;
    }
}


