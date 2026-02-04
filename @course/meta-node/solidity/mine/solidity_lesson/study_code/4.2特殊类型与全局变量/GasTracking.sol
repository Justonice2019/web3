// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GasTracking {
    function getGasUsed () public view returns (uint gasInitial, uint gasUsed) {
        gasInitial = gasleft();

        uint sum = 0;
        for(uint i = 0; i < 100; i ++) {
            sum += i;
        }
        gasUsed = gasInitial - gasleft();
        return (
            gasInitial,
            gasUsed
        );

    }
}