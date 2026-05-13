// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract LoopTest {
    function testFor() public pure returns (uint256[10] memory retArr) {
        for (uint256 i = 0; i < 10; i++) {
            if (i == 3) {
                continue;
            }
            if (i == 6) {
                break;
            }
            retArr[i] = 100 + i;
        }
        return retArr;
    }

    function testWhile() public pure returns (uint256[10] memory retArr) {
        uint256 i = 0;
        while (i < 10) {
            retArr[i] = 100 + i;
            i++;
        }
        return retArr;
    }

    function testDoWhile() public pure returns (uint256[10] memory retArr) {
        uint256 i = 0;
        do {
            retArr[i] = 100 + i;
            i++;
        } while (i < 10);
        return retArr;
    }
}
