// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
  constructor(uint256 initialSupply) ERC20("TOKENA", "TKA") {
    _mint(msg.sender, initialSupply);
  }
}