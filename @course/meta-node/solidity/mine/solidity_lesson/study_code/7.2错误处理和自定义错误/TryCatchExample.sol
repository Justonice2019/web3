// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TryCatchExample {
    // 定义不带参数的错误
    error Unauthorized();
    // 定义带参数的错误
    error InsufficientBalance(uint256 available, uint256 required);
    // 定义带多个参数的错误
    error InvalidTransfer(address from, address to, uint256 amount, string reason);

    error CustomErr (string msg);
    function doSth(uint value) public pure returns (uint) {
        require(value != 1, "require");
        if (value == 2) {
            revert("revert");
        }
        if (value == 3) {
            assert(false);
        }
        if (value == 4) {
            revert CustomErr("CustomErr");
        }

        return value;
    }

    function test(uint value) public view returns (string memory errMsg, uint errCode){
        try this.doSth(value) returns (uint) {
            errMsg = "";
        } catch Error(string memory reason) {
            // 捕获字符串错误（require/revert with string）
            errCode = 100;
            errMsg = reason;
        } catch Panic (uint _errCode) {
            // 捕获Panic错误（assert/运行时错误）
            errCode = 300;
            errMsg = "assert";
        } catch (bytes memory lowlevelData) {
            // 捕获自定义错误和其他错误
            errCode = 400;
            // errMsg = string(lowlevelData); // err 本质编码还是不太一样 会出现解码错误
            errMsg = "custom err";
        }
    }

   function getMsgSender() public view returns (address) {
        return msg.sender;
    }
    function testThisAndUnThis() public view returns (address, address) {
        return (
            getMsgSender(), // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 账户地址
            this.getMsgSender() // 0xcF037f9f75F35362Fc21e4CA879C8281AB53C39A 合约地址
        );
    }

}