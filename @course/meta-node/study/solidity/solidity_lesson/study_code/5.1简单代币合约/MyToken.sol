// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public immutable owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10 ** _decimals;
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;

        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 amount) public returns (bool)  {
        // 1. 检查接收地址
        require(to != address(0), "Cannot transfer to zero address");

        // 2. 检查余额
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function approve (address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        // 1. 检查地址有效性
        require(from != address(0), "From zero");
        require(to != address(0), "To zero");

        // 2. 检查余额
        require(balanceOf[from] >= amount, "Insufficient balance");

        // 3. 检查授权额度
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        // 4. 执行转账
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        // 5. 减少授权额度
        allowance[from][msg.sender] -= amount;

        // 6. 触发事件
        emit Transfer(from, to, amount);

        // 7. 返回成功
        return true;
    }
}
