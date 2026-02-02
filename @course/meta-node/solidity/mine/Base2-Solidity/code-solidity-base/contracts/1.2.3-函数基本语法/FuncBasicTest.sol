// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0 < 0.9.0;

contract FuncBasicTest {
    string public greeting = "Hello";
    function getInfo (string memory name) public view returns (string memory) {
        return string.concat(greeting, " ", name);
    }

    // 可见性修饰符	当前合约	其他合约	子合约	外部账户
    // public	    1	       1	       1	   1
    // external	    0          1	       0	   1
    // private	    1    	   0	       0	   0
    // internal   	1	       0	       1       0

    // external
    // function testExternal (string memory name) public view returns (string memory) {
    //     return sayHelloExternal(name); // DeclarationError: Undeclared identifier. "sayHelloExternal" is not (or not yet) visible at this point.
    // }
    // function sayHelloExternal (string memory name) external view returns (string memory) { // external 改为 public 可以被访问
    //        return string.concat(greeting, name);
    // }

    // private
    function testPrivate(
        string memory name
    ) public view returns (string memory) {
        return sayHelloPrivate(name);
    }
    function sayHelloPrivate(
        string memory name
    ) private view returns (string memory) {
        return string.concat(greeting, name);
    }

    // interval
    function testInterval(
        string memory name
    ) public view returns (string memory) {
        return sayHelloPrivate(name);
    }
    function sayHelloInterval(
        string memory name
    ) internal view returns (string memory) {
        return string.concat(greeting, name);
    }

    // pure 读取: 否, 写入: 否
    // function testPure (string memory name) public pure returns (string memory) { // TypeError: Function declared as pure, but this expression (potentially) reads from the environment or state and thus requires "view".
    //     return string.concat(greeting, name);
    // }
     function testPure2 (string memory name) public pure returns (string memory) {
        return string.concat("Hello ", name);
    }


    // view 读取: 是, 写入: 否
    function testView1(string memory name) public view returns (string memory) {
        return string.concat(greeting, name);
    }
    // function testView2(string memory name) public view returns (string memory) {
    //     hello = "hello2"; // 不可以写
    //     return string.concat(hello, name); // TypeError: Function cannot be declared as view because this expression (potentially) modifies the state.
    // }

    // default 读取: 是, 写入: 是
    function testDefault(string memory name) public view returns (string memory) {
        return string.concat(greeting, name);
    }
    function testDefault2(string memory name) public returns (string memory) {
        greeting = "hello world "; // 支持读写
        return string.concat(greeting, name);
    }
}