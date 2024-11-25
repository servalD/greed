// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

// ERC-721 proxy contract
contract Proxy {

    // Address of the ERC-721 contract to which calls will be forwarded
    address public erc721Contract;

    constructor(address _erc721Contract) {
        erc721Contract = _erc721Contract;
    }

    // Fallback function to forward calls to the erc-721 contract
    fallback() external payable {
        _forwardCall();
    }

    // Receive function to forward calls to the erc-721 contract
    receive() external payable {
        _forwardCall();
    }

    // Function to forward calls to the erc-721 contract
    function _forwardCall() internal {
        // Forward the call to the erc-721 contract
        (bool success, bytes memory result) = erc721Contract.call(msg.data);

        // If the call was successful, return the result
        if (success) {
            assembly {
                return(add(result, 32), mload(result))
            }
        } else {
            // If the call was not successful, revert with the error message
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }
}
