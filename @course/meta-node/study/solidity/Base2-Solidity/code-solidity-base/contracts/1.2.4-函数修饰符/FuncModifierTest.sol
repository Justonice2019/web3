// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract FuncModifierTest {
    // 1.
    // 常量
    uint public constant CONTANT_VAR = 1000;
    uint256 public immutable IMMUTABEL_VAR = 2000;
    uint256 public immutable IMMUTABEL_VAR_2;
    constructor() {
        // CONTANT_VAR = 1001; // 不可以被再次赋值
        IMMUTABEL_VAR_2 = 2001;
    }

    // 2.
    // pure函数 中的变量全部在栈上
    function pureFunc(
        uint256 a,
        uint256 b,
        uint256 c
    ) public pure returns (uint256) {
        uint256 sum = a + b + c;
        return sum;
    }

    // view函数 会执行sload操作
    uint private baseSum = 100;
    function viewFunc(
        uint256 a,
        uint256 b,
        uint256 c
    ) public view returns (uint256) {
        uint256 sum = baseSum + a + b + c;
        return sum;
    }

    // default函数 会执行sload操作 也可以执行sstore
    uint256[] storageArr;
    function defaultFunc(uint256 account) public returns (uint256[] memory) {
        storageArr.push(account);
        return storageArr;
    }

    // 3. storage memory calldata
    // storage 状态变量 存储在 storage => stateDB
    uint256 public stateVar = 100;
    // uint256 public storage stateVar2 = 100; // 不要去声明storage声明反而不对 // ParserError: Expected identifier but got 'storage'
    mapping(address => uint256) public balances;
    uint256[] someStorageArray;

    // 如何在函数里面声明这些存储方式
    // 3.1 存进 memory
    function testMemory1() public pure returns (uint256[] memory) {
        uint256[] memory memoryArr = new uint256[](3);
        return memoryArr;
    }
    function testMemory2() public pure returns (string memory) {
        string memory str = "hello!";
        return str;
    }
    function testMemory3() public pure returns (bytes memory) {
        bytes memory b = new bytes(10);
        return b;
    }
    // 3.2 存进 stack
    function testStack() public pure returns (uint8) {
        // 未使用过的变量会被标记为报错所以才注释掉的
        // uint256 stackVar1 = 123;
        // bool flag = false;
        // address sender = msg.sender;
        uint8 smallNum = 100;
        return smallNum;
    }

    // 3.3 存进 storage
    function testStorage1() public view returns (uint256[] memory) {
        // 在 Solidity 中，函数的返回值不能是 storage 类型，只能是 memory 或 calldata（对于外部函数）
        uint256[] storage s = someStorageArray; // storage 变量必须指向一个已存在的存储变量，不能直接赋值为字符串字面量
        return s;
    }
}

contract TestDataLocation {
    // 存储变量 - 永久存储在区块链上
    string public storageStr = "initial value";
    uint256[] public storageArr = [1, 2, 3, 4, 5];
    struct Person {
        string name;
        uint256 age;
        address wallet;
    }
    Person public p =
        Person("Tom", 18, 0xF1DC5Df8114fdd22B43a3925C8A0A768A776D885);
    Person[] public peopleStorage;

    // ================ memory 示例 ================
    // 1. 返回 memory 数据
    function getMemoryStr() public pure returns (string memory) {
        // memory: 函数内部的临时变量，函数结束时销毁
        string memory localStr = "I am in memory";
        return localStr;
    }
    // 2. 创建新的 memory 数组
    function createMemoryArr() public pure returns (uint256[] memory) {
        uint256[] memory newArr = new uint256[](3);
        newArr[0] = 100;
        newArr[1] = 200;
        newArr[2] = 300;
        return newArr;
    }
    // 3. memory 作为参数和局部变量
    function processWithMemory(
        string memory input
    ) public pure returns (string memory) {
        // 参数和局部变量都是 memory
        string memory processed = string.concat(input, " - processed");
        return processed;
    }

    // ================ storage 示例 ================
    // 1. 修改 storage 变量
    function updateStorageStr() public {
        storageStr = "Updated Storage Value";
    }
    // 2. 使用 storage 引用修改数据
    function updateStorageArr() public {
        uint256[] storage arr = storageArr;
        arr[0] = 999;
        arr.push(6); // 添加新元素
    }
    // 3. storage 引用不能作为返回值
    function getStorageArrayLength() public view returns (uint256) {
        uint256[] storage arr = storageArr; // storage 引用
        return arr.length; // 只能返回值类型，不能返回引用本身
    }
    // 4. 结构体的 storage 操作
    function addPersonStorage(string memory name, uint256 age) public {
        // 在 storage 中添加新元素
        peopleStorage.push(Person({name: name, age: age, wallet: msg.sender}));
    }
    function updatePersonStorage(uint256 index, string memory newName) public {
        require(index < peopleStorage.length, "Invalid index");

        // 获取 storage 引用并修改
        Person storage person = peopleStorage[index];
        person.name = newName;
    }
    // ================ calldata 示例 ================
    function processCalldata (string calldata input) external pure returns (string memory) {
        string memory result = string.concat("received", input);
        return result;
    }
}
