// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

// ERC-721 proxy contract
contract Proxy {

    // Address of the ERC-721 contract to which calls will be forwarded
    address public erc721Contract;
    // Address of the Safe contract that owns the proxy contract
    address public owner;

    constructor(address _erc721Contract, address safeAddress) {
        // Set the address of the ERC-721 contract to which calls will be forwarded
        erc721Contract = _erc721Contract;
        // Set the owner of the proxy contract to the Safe contract
        owner = safeAddress;
    }

    // Function to forward calls to the ERC-721 contract
    function _forwardCall() internal {
        (bool success,) = erc721Contract.delegatecall(msg.data);
        require(success, "Delegate call failed");
    }

    // Fallback function to forward calls to the erc-721 contract
    fallback() external payable {
        _forwardCall();
    }

    // Receive function to forward calls to the erc-721 contract
    receive() external payable {
        _forwardCall();
    }

}
