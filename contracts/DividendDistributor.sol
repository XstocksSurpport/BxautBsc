// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DividendDistributor
 * @notice Placeholder matching the front-end ABI: `pendingReward` is per-address
 *         storage (defaults 0); `claim` clears local accounting. Replace with the
 *         full distributor when rewards are wired on-chain.
 */
contract DividendDistributor {
    mapping(address => uint256) public pendingReward;

    event Claimed(address indexed user, uint256 amount);

    function claim() external {
        uint256 owed = pendingReward[msg.sender];
        pendingReward[msg.sender] = 0;
        emit Claimed(msg.sender, owed);
    }
}
