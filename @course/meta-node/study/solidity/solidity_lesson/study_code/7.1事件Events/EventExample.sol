// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/Strings.sol";
contract EventExample {
    // 最多三个 indexed
    event Transfer(address indexed from, address to, uint256 value);

    function transfer(uint amount) public {
        emit Transfer(msg.sender, address(this), amount);
        //     "topics": [
        //      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        //      "0x0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4"
        //    ],
    }

    function test() public pure returns (bytes memory) {
        // return bytes("Transfer(address,address,uint256)");
        // return bytes(abi.encode(123)); // 0x000000000000000000000000000000000000000000000000000000000000007b
        // return bytes("123"); // 0x313233
        // return bytes(abi.encode("123")); // 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000033132330000000000000000000000000000000000000000000000000000000000
        return bytes(abi.encodePacked("123")); // 0x313233
    }
    function getFuncSign() public pure returns (string memory) {
        // bytes32 hash = keccak256("Transfer(address,address,uint256)");
        bytes32 hash = keccak256(bytes("Transfer(address,address,uint256)"));
        return Strings.toHexString(uint256(hash)); //  0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
    }

    event TransferString(string indexed message);
    event TransferBytes(bytes indexed message);
    event TransferBytes32(bytes32 indexed message);
    function testTransferString() public {
        emit TransferString("hello");
        //     "topics": [
        //      "0xeba8b32b1989425d36dfc3f715d585f2980f9575170842667f2fa0cdf8e19aa8",
        //      "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8" // hash
        //    ],
    }
    function testTransferBytes() public {
        emit TransferBytes("hello");
        //   "topics": [
        //      "0x57c801e3add2c04b88dde57a8ede83aff9abcdecde5546a2daa0b1061b9aa79e",
        //      "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8" // hash
        //    ],

        // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

    }
    function testTransferBytes32() public {
        emit TransferBytes32(bytes32(bytes("hello")));
        //    "topics": [
        //      "0x4c4c3c7030d27342b7ff8569c3910d289792a88600dc58099830fd83fc3f18f7",
        //      "0x68656c6c6f000000000000000000000000000000000000000000000000000000" // 'hello'
        //    ],
    }

    event TransferAnonymous(address indexed from, address indexed to, uint256 indexed value, bytes32 indexed data) anonymous;
    function testTransferAnonymous() public {
        emit TransferAnonymous(msg.sender, address(this), 100, bytes32("hello"));
        //   "topics": [
        //      "0x0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4", // from
        //      "0x000000000000000000000000a6165bbb69f7e8f3d960220b5f28e990ea5f630d", // to
        //      "0x0000000000000000000000000000000000000000000000000000000000000064", // value
        //      "0x68656c6c6f000000000000000000000000000000000000000000000000000000" // data
        //    ],
    }


}
