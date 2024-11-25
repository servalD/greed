// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


// create erc-721 implementation pointed by a proxy
contract ERC721Implementation is ERC721 {
    constructor() ERC721("ERC721Implementation", "ERC721IMPL") {}
}

// create proxy contract
contract ERC721Proxy is ERC1967Proxy {
    constructor(address _logic) ERC1967Proxy(_logic) {}
}

// create proxy factory
contract ERC721ProxyFactory {
    function createProxy(address _logic) public returns (ERC721Proxy) {
        ERC721Proxy proxy = new ERC721Proxy(_logic);
        return proxy;
    }
}
