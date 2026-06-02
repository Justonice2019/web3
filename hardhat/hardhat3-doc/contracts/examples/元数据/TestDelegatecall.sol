// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TestDelegatecall {
    string public initResult;

    // constructor(bytes memory data) {}

    function run(bytes memory data) public returns (string memory) {
        if (data.length > 0) {
            (bool success, bytes memory result) = address(this).delegatecall(
                data
            );
            require(success, "xxxx");
            return string(result);
        }
        return "yyy";
    }

    function initialize() public pure returns (string memory) {
        return "initialize";
    }
}
