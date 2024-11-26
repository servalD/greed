// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


// create erc-721 implementation pointed by a proxy
contract ERC721Implementation is ERC721 {
    constructor() ERC721("ERC721Implementation", "ERC721IMPL") {}
}
