// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ShovelNFT
 * @notice Three tiers (iron / silver / gold), USDT-priced mints on BSC. All USDT
 *         from mints is sent to `treasury` (no retained balance in this contract).
 * @dev Token IDs are fixed per tier band so off-chain metadata can be deterministic:
 *      Iron 1–666, Silver 667–777, Gold 778–799 (799 total).
 */
contract ShovelNFT is ERC721, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdt;
    address public immutable treasury;

    uint256 public constant TIER_COUNT = 3;

    uint256[TIER_COUNT] private _minted;

    string private _baseUri;

    function _tierFirst(uint8 tier) private pure returns (uint256) {
        if (tier == 0) return 1;
        if (tier == 1) return 667;
        return 778;
    }

    function _mintPriceWei(uint8 tier) private pure returns (uint256) {
        if (tier == 0) return 1 ether;
        if (tier == 1) return 11 ether;
        return 111 ether;
    }

    function _maxSupplyTier(uint8 tier) private pure returns (uint256) {
        if (tier == 0) return 666;
        if (tier == 1) return 111;
        return 22;
    }

    event ShovelMinted(
        address indexed to,
        uint8 indexed tier,
        uint256 indexed tokenId
    );

    constructor(
        address usdt_,
        address treasury_,
        address initialOwner,
        string memory baseURI_
    ) ERC721("Bxaut Shovels", "BXSHOVEL") Ownable(initialOwner) {
        require(usdt_ != address(0), "ShovelNFT: usdt");
        require(treasury_ != address(0), "ShovelNFT: treasury");
        usdt = IERC20(usdt_);
        treasury = treasury_;
        _baseUri = baseURI_;
    }

    function mintPrice(uint8 tier) external pure returns (uint256) {
        require(tier < TIER_COUNT, "ShovelNFT: tier");
        return _mintPriceWei(tier);
    }

    function maxSupply(uint8 tier) external pure returns (uint256) {
        require(tier < TIER_COUNT, "ShovelNFT: tier");
        return _maxSupplyTier(tier);
    }

    function totalMinted(uint8 tier) external view returns (uint256) {
        require(tier < TIER_COUNT, "ShovelNFT: tier");
        return _minted[tier];
    }

    function mint(uint8 tier) external nonReentrant {
        require(tier < TIER_COUNT, "ShovelNFT: tier");
        require(_minted[tier] < _maxSupplyTier(tier), "ShovelNFT: sold out");

        uint256 price = _mintPriceWei(tier);
        usdt.safeTransferFrom(msg.sender, treasury, price);

        uint256 tokenId = _tierFirst(tier) + _minted[tier];
        unchecked {
            _minted[tier]++;
        }
        _safeMint(msg.sender, tokenId);

        emit ShovelMinted(msg.sender, tier, tokenId);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseUri = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat(_baseURI(), Strings.toString(tokenId), ".json");
    }
}
