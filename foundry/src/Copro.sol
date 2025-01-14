// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { ERC721, IERC721} from "@openzeppelin/token/ERC721/ERC721.sol";
import {ERC721Consecutive} from "@openzeppelin/token/ERC721/extensions/ERC721Consecutive.sol";
import {AccessManaged} from "@openzeppelin/access/manager/AccessManaged.sol";
import {AccessManager} from "@openzeppelin/access/manager/AccessManager.sol";
import {IRoleDefinition} from "./IRoleDefinition.sol";

contract Copro is ERC721Consecutive, AccessManaged, IRoleDefinition {
    // Errors
    error SoldOutError();
    error InvalidFlatCount();
    error ExceedsMaxBatchSize();
    error NotFlatOwner();
    error FlatNotForSale();
    error InvalidAmount();
    // Static
    address payable private safe;
    uint256 public immutable flatCount;
    // Structures
    struct Proposal {
        address part;// The owner or a client
        uint256 amount;
    }

    // Variables
    mapping(uint256 => Proposal[]) public proposals;// tokenId => Proposals
    mapping(uint256 => uint256) public market;// tokenId => Owner Proposal
    uint256 fees_ratio = 2;// % to safe
    mapping(uint256 => Proposal[]) public history;// tokenIzd => Successful transaction history

    // Events
    event FlatMinted(address indexed owner, uint256 tokenId);
    event FlatRecovered(uint256 tokenId, address indexed previousOwner, address indexed admin);

    constructor(AccessManager manager,address promoter, string memory name, string memory symbol, uint96 _flatCount, address payable _SAFE) ERC721(name, symbol) AccessManaged(address(manager)) {
        if (_flatCount <= 0) {
            revert InvalidFlatCount();
        }
        if (_flatCount >= _maxBatchSize()) {
            revert ExceedsMaxBatchSize();
        }
        flatCount = _flatCount;
        safe = _SAFE;
        // Batch transfer to the promoter (the owner of all flat at Agency deployment)
        _mintConsecutive(promoter, _flatCount);// Constrained type (uint96) propagated to _flatCount
        for (uint256 i=0; i<_flatCount; i++) market[i] = 0;// Ensure nothing is for sale 
    }

    // Modifiers
    modifier onlyTokenOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotFlatOwner();
        }
        _;
    }

    // Implementation
    function sell(uint256 tokenId, uint256 amount) public onlyTokenOwner(tokenId){
        _approve(address(this), tokenId, msg.sender);
        market[tokenId] = amount;
    }

    function cancelSale(uint256 tokenId) public onlyTokenOwner(tokenId){
        _approve(address(0), tokenId, msg.sender);
        market[tokenId] = 0;
    }

    function buy(uint256 tokenId) public payable restricted {
        if (market[tokenId] == 0) {
            revert FlatNotForSale();
        }
        if (msg.value != market[tokenId]) {
            revert InvalidAmount();
        }
        
        _safeTransfer(ownerOf(tokenId), msg.sender, tokenId);
        _approve(address(0), tokenId, msg.sender);

        // Transfer the fees to the safe
        safe.transfer(msg.value * fees_ratio / 100);
        // Transfer the rest to the owner
        payable(ownerOf(tokenId)).transfer(msg.value * (100 - fees_ratio) / 100);
        // Update the market
        market[tokenId] = 0;

        // Update the history
        history[tokenId].push(Proposal(msg.sender, msg.value));
    }

    // No getter for market and history as it's public so th'ey can be accessed directly (to lower gas cost at deployment)

    // Disabled code (in prod and before audits, I'll decide to comment out unneeded code in sources which is cleaner and gas free. For now it's more explicit.)
    // function safeTransferFrom(address from, address to, uint256 tokenId) public override {revert("disabled");} // Not virtual

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {revert("disabled");}

    function transferFrom(address from, address to, uint256 tokenId) public override {revert("disabled");}

    function approve(address to, uint256 tokenId) public override {revert("disabled");}

    function setApprovalForAll(address operator, bool approved) public override {revert("disabled");}

}
