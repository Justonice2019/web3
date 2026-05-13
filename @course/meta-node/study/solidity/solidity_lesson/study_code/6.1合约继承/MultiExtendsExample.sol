// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract GrandParent {
    function identify() public virtual returns (string memory) {
        return "GrandParent";
    }
}

contract Parent1 is GrandParent {
    function identify() public virtual override returns (string memory) {
        return "Parent1";
    }
}

contract Parent2 is GrandParent {
    function identify() public virtual override returns (string memory) {
        return "Parent2";
    }
}

contract Child is GrandParent, Parent1, Parent2 {
    // 重写
    function identify()
        public
        pure
        override(GrandParent, Parent1, Parent2)
        returns (string memory)
    {
        return "Child";
    }

    // err: 必须声明3个合约才能重写
    // function identify() public pure override(GrandParent, Parent1) returns (string memory) {
    //     return "Child";
    // }
}
