// ─────────────────────────────────────────────────────────────────────────
// CONTRACT CONFIG — fill these in with your real Foundry deployment values
// ─────────────────────────────────────────────────────────────────────────

// 1. CONTRACT ADDRESS
//    After `forge script ... --broadcast` or `forge create`, copy the
//    "Deployed to:" address printed in your terminal (or read it from
//    broadcast/<ScriptName>.s.sol/31337/run-latest.json -> contractAddress).
export const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";

// 2. CONTRACT ABI
//    After building with `forge build`, open:
//      out/<YourContract>.sol/<YourContract>.json
//    and copy the value of the "abi" field. Paste it below as an array.
//    Only deposit/withdraw/balance-reading entries are required for the UI
//    below, but it's safest to paste the whole ABI array.
export const CONTRACT_ABI = [
  // Example shape — REPLACE with your real ABI array from forge build output
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalValueLocked",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// 3. FOUNDRY ANVIL NETWORK
//    Default Anvil chain ID and RPC URL. Change PORT if you started Anvil
//    with a custom --port flag.
export const FOUNDRY_CHAIN_ID = 31337n; // ethers v6 uses BigInt for chainId
export const FOUNDRY_CHAIN_ID_HEX = "0x7a69"; // 31337 in hex, used for wallet_addEthereumChain
export const FOUNDRY_RPC_URL = "http://127.0.0.1:8545";
export const FOUNDRY_NETWORK_NAME = "Foundry (Anvil)";

export const FOUNDRY_CHAIN_PARAMS = {
  chainId: FOUNDRY_CHAIN_ID_HEX,
  chainName: FOUNDRY_NETWORK_NAME,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [FOUNDRY_RPC_URL],
};
