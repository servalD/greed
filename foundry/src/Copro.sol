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
    uint256 fees_ratio;// To safe
    mapping(uint256 => Proposal[]) public history;// tokenIzd => Successful transaction history

    // Events
    event FlatMinted(address indexed owner, uint256 tokenId);
    event FlatRecovered(uint256 tokenId, address indexed previousOwner, address indexed admin);

    constructor(AccessManager manager,address promoter, string memory name, string memory symbol, uint96 _flatCount, address payable _SAFE) ERC721(name, symbol) AccessManaged(address(manager)) {
        require(_flatCount > 0, "No Copro can be empty");
        require(_flatCount < _maxBatchSize(), "Unable to create a copro with more than 5000");// See https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Consecutive
        flatCount = _flatCount;
        safe = _SAFE;
        // Batch transfer to the promoter (the owner of all flat at Agency deployment)
        _mintConsecutive(promoter, _flatCount);// Constrained type (uint96) propagated to _flatCount
        for (uint256 i=0; i<_flatCount; i++) market[i] = 0;// Ensure nothing is for sale 
    }

    // Modifiers
    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "You're not the flat owner!");
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
        require(msg.value == market[tokenId], "Invalid amount");
        _safeTransfer(ownerOf(tokenId), msg.sender, tokenId);
        _approve(address(0), tokenId, msg.sender);
        market[tokenId] = 0;
    }

    // Disabled code (in prod and before audits, I'll decide to comment out unneeded code in sources which is cleaner and gas free. For now it's more explicit.)
    // function safeTransferFrom(address from, address to, uint256 tokenId) public override {revert("disabled");} // Not virtual

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {revert("disabled");}

    function transferFrom(address from, address to, uint256 tokenId) public override {revert("disabled");}

    function approve(address to, uint256 tokenId) public override {revert("disabled");}

    function setApprovalForAll(address operator, bool approved) public override {revert("disabled");}

}
