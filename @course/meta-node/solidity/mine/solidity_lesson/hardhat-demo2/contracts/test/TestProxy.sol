// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Logic1 {
    uint256 private val;

    function setVal(uint256 _val) public {
        val = _val + 1;
    }

    function getVal() public view returns (uint256) {
        return val;
    }
}

contract Logic2 {
    uint256 private val;

    function setVal(uint256 _val) public {
        val = _val + 2;
    }

    function getVal() public view returns (uint256) {
        return val;
    }
}

interface ILogic {
    function setVal(uint256 _val) external;
    function getVal() external returns (uint256);
}

contract Proxy {
    ILogic public logic;
    function setLogic(address _loginAddr) public {
        logic = ILogic(_loginAddr);
    }
    function getLogic() public view returns (address) {
        return address(logic);
    }
     function setVal(uint256 _val) public {
        logic.setVal(_val);
    }

    function getVal() public returns (uint256) {
        return logic.getVal();
    }
}
