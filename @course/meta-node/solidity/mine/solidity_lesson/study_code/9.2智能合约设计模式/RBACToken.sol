// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
contract RBACToken {
    mapping (bytes32 => mapping (address => bool)) public roles;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");

    mapping (address => uint256) public balances;
    uint256 public totalSupply;

    event RoleGranted(bytes32 indexed roleName, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed roleName, address indexed account, address indexed sender);


    constructor () {
        roles[ADMIN_ROLE][msg.sender] = true;
        emit RoleGranted(ADMIN_ROLE, msg.sender, msg.sender);
    }

    function getRole(string memory roleName, address account) public view returns (bool) {
        return roles[keccak256(bytes(roleName))][account];
    }

    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "Access Failed!");
        _;
    }
    function grantRole (string memory role, address account) public onlyRole(ADMIN_ROLE) {
        bytes32 bRole = keccak256(abi.encodePacked(role));
        require(!roles[bRole][account], "Account has granted");
        roles[bRole][account] = true;
        emit RoleGranted(bRole, account, msg.sender);
    }
    function revokeRole (bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        require(roles[role][account], "Account has granted");
        roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }

    function mint(address to, uint256 amount) onlyRole(MINTER_ROLE) public {
        balances[to] += amount;
        totalSupply += amount;
    }
}