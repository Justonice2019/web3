// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// 简单的计数器合约
contract Counter {
    uint256 public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
        count = 0;
    }

    function increment() external {
        require(msg.sender == owner, "Not owner");
        count++;
    }
}

// 工厂合约：使用create2创建确定性地址的合约
contract CounterFactory {
    event CounterCreated(address indexed counterAddress, bytes32 salt);

    /**
     * @notice 使用new创建（地址不可预测）
     */
    function createWithNew() external returns (address) {
        Counter counter = new Counter(msg.sender);
        return address(counter);
    }

    /**
     * @notice 使用create2创建（地址可预测）
     * @param salt 用于计算地址的盐值
     * @return 新创建的计数器合约地址
     */
    function createWithCreate2(bytes32 salt) external returns (address) {
        // 使用create2创建，指定salt值
        Counter counter = new Counter{salt: salt}(msg.sender);

        address counterAddress = address(counter);
        emit CounterCreated(counterAddress, salt);

        return counterAddress;
    }

    /**
     * @notice 预计算create2地址
     * @param salt 盐值
     * @param deployer 部署者地址（通常是本合约地址）
     * @return 预计算的合约地址
     */
    function computeAddress(bytes32 salt, address deployer)
    external
    view
    returns (address)
    {
        // 获取合约的创建字节码
        // type(Counter).creationCode 获取Counter合约的字节码
        // abi.encode(msg.sender) 编码构造函数参数
        bytes memory bytecode = abi.encodePacked(
            type(Counter).creationCode,
            abi.encode(msg.sender)
        );

        // 计算create2地址
        // 公式：keccak256(0xff + deployer + salt + keccak256(bytecode))
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                deployer,  // 工厂合约地址
                salt,      // 盐值
                keccak256(bytecode)  // 字节码的哈希
            )
        );

        // 将哈希转换为地址（取后20字节）
        return address(uint160(uint256(hash)));
    }
}