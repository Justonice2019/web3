// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name;
    string public symbol;
    address public creator;
    uint256 public totalSupply;

    mapping (address => uint256) public balances;

    constructor (string memory _name, string memory _symbol, uint256 _supply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _supply;
        creator = msg.sender;
        balances[msg.sender] = _supply;
    }

    function transfer (address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "not balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}

contract TokenFactory {
    SimpleToken[] public tokens;
    mapping (address => address[]) public userTokens;

    function createToken(string memory name, string memory symbol, uint256 initialSupply) public  returns (address) {
        SimpleToken newToken = new SimpleToken(name, symbol, initialSupply);
        tokens.push(newToken);
        address tokenAddr = address(newToken);
        userTokens[msg.sender].push(tokenAddr);
        return tokenAddr;
    }

    function getTokensLength() public view returns (uint256) {
        return tokens.length;
    }

    function getUser(address account) public view returns (address[] memory) {
        return userTokens[account];

    }
}