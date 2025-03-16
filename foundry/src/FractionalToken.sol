// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/token/ERC20/ERC20.sol";
import "@openzeppelin/access/Ownable.sol";
import "@openzeppelin/token/ERC721/IERC721Receiver.sol";

contract FractionalToken is ERC20, Ownable, IERC721Receiver {

    // =============================================================
    //                          EVENTS
    // =============================================================

    event ReceivedNFT(address operator, address from, uint256 tokenId, bytes data);

    // =============================================================
    //                          MAPPINGS
    // =============================================================

    mapping(address => uint256) supply;

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    /**
     * @notice ERC20 contract which represents the property of an NFT.
     * @param name name of token
     * @param symbol symbol of token
     * @param coOwners co-owners of NFT.
     * @param totalSupply total supply of tokens
     */
    constructor(
        string memory name,
        string memory symbol,
        address[] memory coOwners,
        uint256 totalSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        uint256 supplyByCoOwner = totalSupply / coOwners.length;
        for(uint8 i = 0; i < coOwners.length; i ++) {
            _mint(coOwners[i], supplyByCoOwner);
            supply[coOwners[i]] = supplyByCoOwner;
        }
    }
    
    // =============================================================
    //                          FUNCTIONS
    // =============================================================

    /**
     * @notice Permits owner to mint other tokens
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice IERC721Receiver implementation to authorize an NFT reception
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {

        emit ReceivedNFT(operator, from, tokenId, data);

        return IERC721Receiver.onERC721Received.selector;
    }
}
