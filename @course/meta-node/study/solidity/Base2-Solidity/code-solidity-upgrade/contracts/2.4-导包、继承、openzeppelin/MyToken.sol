// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// 引入 OpenZeppelin 的 ERC20 合约
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000);
    }
}

// ps: 使用浏览器版本的remix去连接自己的钱包

// 父合约
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function test() public pure virtual returns (uint256) {
        return 1;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }
}

// 子合约
contract MyContract is Ownable {
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function test() public pure override returns (uint256) {
        return 2;
    }
}
// 0xe2899bddFD890e320e643044c6b95B9B0b84157A
// 0xe2899bddFD890e320e643044c6b95B9B0b84157A