// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Bank {
    event CallLog(bytes input, bytes output);
    receive() external payable {}

    function withdrawWithTransfer() external {
        payable(msg.sender).transfer(1 ether);
    }

    function withdrawWithSend() external {
        bool success = payable(msg.sender).send(1 ether);
        require(success, "Send failed");
    }
    // 0xd9145CCE52D386f254917e481eB44e9943F39138
    // 0xf8e81D47203A594245E36C48e151709F0C19fBe8
    // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    function withdrawWithCall(bytes memory input) external {
        // (bool success, bytes memory data) = payable(msg.sender).call{value: 1 ether}("");
        (bool success, bytes memory data) = payable(msg.sender).call{value: 1 ether}(input);
        require(success, "Call failed");
        emit CallLog(input, data);
    }
}

contract BankUser {
    Bank bank;

    constructor(address payable _bank) {
        bank = Bank(_bank);
    }

    receive() external payable {}
    function withdrawWithTransfer() external {
        bank.withdrawWithTransfer();
    }

    function withdrawWithSend() external {
        bank.withdrawWithSend();
    }

    function withdrawWithCall(bytes memory input) external {
        bank.withdrawWithCall(abi.encodePacked(input));
    }

    function testPay() external payable returns (address) {
        return 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    }
}

