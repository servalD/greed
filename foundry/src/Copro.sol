// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721, IERC721} from "@openzeppelin/token/ERC721/ERC721.sol";
import {AccessManaged} from "@openzeppelin/access/manager/AccessManaged.sol";

contract Copro is ERC721, AccessManaged {
    // Errors
    error SoldOutError();
    // Static
    address payable private SAFE;

    // Variables
    uint256 public immutable flatCount;
    uint256 public currentFlatId;

    // Events
    event ClientAccepted(address indexed client);
    event FlatMinted(address indexed owner, uint256 tokenId);
    event FlatRecovered(uint256 tokenId, address indexed previousOwner, address indexed admin);

    constructor(address initialAuth, string memory name, string memory symbol, uint256 _flatCount, address payable _SAFE) ERC721(name, symbol) AccessManaged(initialAuth) {
        require(_flatCount > 0, "No Condominium can be empty");
        // _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _grantRole(MANAGER_ROLE, msg.sender);
        flatCount = _flatCount;
        currentFlatId = 0; 
        SAFE = _SAFE;
    }

    function acceptClient(address _client) external restricted {
        // require(!hasRole(MINTER_ROLE, _client), "Client already accepted");
        // _grantRole(MINTER_ROLE, _client);
        emit ClientAccepted(_client);
    }

    function mint() external restricted {
        if (currentFlatId >= flatCount) revert SoldOutError();

        uint256 newFlatId = currentFlatId;
        currentFlatId += 1;

        _mint(msg.sender, newFlatId);

        // _revokeRole(MINTER_ROLE, msg.sender);
        emit FlatMinted(msg.sender, newFlatId);
    }

    function transferFlat(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this flat");
        // require(hasRole(to), '');
        super.safeTransferFrom(msg.sender, to, tokenId);
    }

    function recoverFlat(uint256 tokenId) external restricted {
        address previousOwner = ownerOf(tokenId);
        // TODO: ajout d'un approval
        _transfer(previousOwner, msg.sender, tokenId);
        emit FlatRecovered(tokenId, previousOwner, msg.sender);
    }

}
