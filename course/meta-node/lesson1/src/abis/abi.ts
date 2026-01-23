// export const abi = [
//   {
//     type: 'function',
//     name: 'balanceOf',
//     stateMutability: 'view',
//     inputs: [{ name: 'account', type: 'address' }],
//     outputs: [{ type: 'uint256' }],
//   },
//   {
//     type: 'function',
//     name: 'totalSupply',
//     stateMutability: 'view',
//     inputs: [],
//     outputs: [{ name: 'supply', type: 'uint256' }],
//   },
// ] as const


export const abi = [
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const