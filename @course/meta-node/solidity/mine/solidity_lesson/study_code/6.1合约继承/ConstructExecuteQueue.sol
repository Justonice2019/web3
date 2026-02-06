// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


contract A {
    event LogA(string message);
    
    constructor() {
        emit LogA("A constructor");
    }
}

contract B {
    event LogB(string message);
    
    constructor() {
        emit LogB("B constructor");
    }
}

contract C is A, B {
    event  LogC(string message);
    
    constructor() {
        emit LogC("C constructor");
    }
}
/*
[
	{
		"from": "0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc",
		"topic": "0x2c97ef1bf565d0aa27910658d6868f60344c016f7d84ccec59549e8780043d34",
		"event": "LogA",
		"args": {
			"0": "A constructor"
		}
	},
	{
		"from": "0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc",
		"topic": "0xbc227f4cc6bf66a4720ae5c43efba09560823aa859c6f6afb05549a257b2db85",
		"event": "LogB",
		"args": {
			"0": "B constructor"
		}
	},
	{
		"from": "0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc",
		"topic": "0x07093231bee6b246869b33e85368e0a59341a93fcf169eb12eeed1705aedb1fb",
		"event": "LogC",
		"args": {
			"0": "C constructor"
		}
	}
]
*/