// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenB is ERC20 {
  constructor(uint256 initialSupply) ERC20("TOKENB", "TKB") {
    _mint(msg.sender, initialSupply);
  }
}