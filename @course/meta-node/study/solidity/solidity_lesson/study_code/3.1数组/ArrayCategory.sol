// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArrayCategory {
    uint[5] public fixedArr;
    function getFixedArr() public view returns (uint[5] memory) {
        return fixedArr; //  0,0,0,0,0
    }

    uint[] public dynamicArr;
    function getDynamicArr() public view returns (uint[] memory) {
        return dynamicArr; // 空
    }

    function pushArrItem(uint _val) public {
        // fixedArr.push(_val); // 不能使用push或pop方法
        dynamicArr.push(_val);
    }

    int256[3] public int256Arr;
    string[3] public strArr;
    bool[3] public boolArr;
    address[3] public addrArr;
    bytes32[3] public bytes32Arr;

    function getInitialValueFrom () public view returns (int256[3] memory, string[3] memory,  bool[3] memory, address[3] memory, bytes32[3] memory){
        return (int256Arr, strArr, boolArr, addrArr, bytes32Arr);
    }

    function createMemoryArray() public pure returns (uint[] memory) {
        // 必须指定长度
        uint[] memory arr = new uint[](5);

        // 可以赋值
        arr[0] = 1;
        arr[1] = 2;
        arr[2] = 3;
        arr[3] = 4;
        arr[4] = 5;

        return arr;
    }

    uint[] public numbers1 = [1, 2, 3, 4, 5]; // 动态数组的初始化
    uint[5] public numbers2 = [1, 2, 3, 4, 5]; // 定长可变长数组的初始化
    function getNum () public returns (uint[] memory) {
        numbers1.push(6);
        // numbers2.push(6); // err
        return numbers1;
    }

    /*
    Storage vs Memory对比：

    特性	Storage数组	Memory数组
    存储位置	区块链上（永久）	内存中（临时）
    创建方式	状态变量声明	new uint[](n)
    长度	可变（动态数组）	固定（创建时确定）
    push/pop	支持	不支持
    Gas成本	高（写入区块链）	低（仅计算）
    生命周期	永久	函数执行期间
    */
    // Memory数组的限制
    function memoryArrayLimitations() public pure returns (uint[] memory) {
        uint[] memory arr = new uint[](5);
        // uint[] memory arr = new uint[](); // err: 不能在memory创建可变长数组
        return arr;
        // 不能push（编译错误）
        // arr.push(6);  // Error!

        // 不能pop（编译错误）
        // arr.pop();  // Error!

        // 不能改变长度
        // arr.length = 10;  // Error!
    }

    // 二维数组声明
    // 动态二维数组
    uint[][] public matrix;

    // 定长二维数组
    uint[3][4] public fixedMatrix;  // 4行，每行3个元素

    // 混合数组
    uint[][5] public mixedArray;  // 5个动态数组
    uint[3][] public mixedArray2;  // 动态数量的定长数组

    // 添加一行
    function addRow(uint[] memory row) public returns(uint[][] memory){
        matrix.push(row);
        return matrix;
    }
}
