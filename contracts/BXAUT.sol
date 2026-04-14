// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BXAUT
 * @notice Fixed 21,000,000 supply minted once to `treasury`. Optional 5% buy + 5% sell fee
 *         when `tradingEnabled` and the counterparty is the configured LP `pair`.
 * @dev Recommended launch: keep `tradingEnabled` false → add Pancake liquidity → `setPair` →
 *      `enableTrading()`. Owner may `setFeeReceiver`, `setExcludedFromTax`, then renounce if desired.
 */
contract BXAUT is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10 ** 18;
    uint256 public constant BPS = 10_000;
    /// @notice 5% when receiving from LP (buy path)
    uint256 public constant BUY_TAX_BPS = 500;
    /// @notice 5% when sending to LP (sell path)
    uint256 public constant SELL_TAX_BPS = 500;

    bool public tradingEnabled;
    address public pair;
    address public feeReceiver;

    mapping(address => bool) public isExcludedFromTax;

    event TradingEnabled(address indexed by);
    event PairUpdated(address indexed newPair);
    event FeeReceiverUpdated(address indexed newFeeReceiver);
    event ExcludedFromTaxUpdated(address indexed account, bool excluded);

    constructor(address treasury) ERC20("Bxaut", "BXAUT") Ownable(_msgSender()) {
        require(treasury != address(0), "BXAUT: treasury");
        feeReceiver = treasury;
        _mint(treasury, MAX_SUPPLY);
        isExcludedFromTax[treasury] = true;
        isExcludedFromTax[_msgSender()] = true;
    }

    function setPair(address newPair) external onlyOwner {
        pair = newPair;
        emit PairUpdated(newPair);
    }

    function setFeeReceiver(address newFeeReceiver) external onlyOwner {
        require(newFeeReceiver != address(0), "BXAUT: feeReceiver");
        feeReceiver = newFeeReceiver;
        emit FeeReceiverUpdated(newFeeReceiver);
    }

    function setExcludedFromTax(address account, bool excluded) external onlyOwner {
        isExcludedFromTax[account] = excluded;
        emit ExcludedFromTaxUpdated(account, excluded);
    }

    /// @notice Irreversible: turn on 5%/5% routing tax (requires `pair` set).
    function enableTrading() external onlyOwner {
        require(pair != address(0), "BXAUT: pair");
        require(!tradingEnabled, "BXAUT: trading on");
        tradingEnabled = true;
        emit TradingEnabled(_msgSender());
    }

    function _update(address from, address to, uint256 value) internal override {
        if (value == 0) {
            super._update(from, to, value);
            return;
        }

        if (!tradingEnabled || from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        if (isExcludedFromTax[from] || isExcludedFromTax[to]) {
            super._update(from, to, value);
            return;
        }

        address p = pair;
        if (p == address(0)) {
            super._update(from, to, value);
            return;
        }

        uint256 feeAmount;
        if (from == p) {
            feeAmount = (value * BUY_TAX_BPS) / BPS;
        } else if (to == p) {
            feeAmount = (value * SELL_TAX_BPS) / BPS;
        }

        if (feeAmount == 0) {
            super._update(from, to, value);
            return;
        }

        address recv = feeReceiver;
        require(recv != address(0), "BXAUT: feeReceiver");

        uint256 sendAmount = value - feeAmount;
        super._update(from, recv, feeAmount);
        super._update(from, to, sendAmount);
    }
}
