// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title BXAUT
 * @notice Fixed 21,000,000 supply. Entire supply is minted once to a single treasury
 *         address at deployment for manual off-chain / later on-chain distribution.
 * @dev Standard ERC20, no transfer tax. Tax / dividend / vesting logic is out of scope
 *      for this minimal deployment.
 */
contract BXAUT is ERC20 {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10 ** 18;

    constructor(address treasury) ERC20("Bxaut", "BXAUT") {
        require(treasury != address(0), "BXAUT: treasury");
        _mint(treasury, MAX_SUPPLY);
    }
}
