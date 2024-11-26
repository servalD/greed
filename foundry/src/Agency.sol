// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Copro} from "./Copro.sol";
import {AccessManaged} from "@openzeppelin/access/manager/AccessManaged.sol";

contract Agency is AccessManaged {
    // =============================================================
    //                            ERRORS
    // =============================================================

    error COLLECTION_NOT_FOUND(string);

    error COLLECTION_NAME_ALREADY_EXISTS(string);

    error COLLECTION_SYMBOL_ALREADY_EXISTS(string);

    // =============================================================
    //                     COLLECTIONS COUNTERS
    // =============================================================

    uint256 public nbListedCollection;

    // =============================================================
    //                            STRUCTS
    // =============================================================

    Copro[] public collections;

    // =============================================================
    //                            EVENTS
    // =============================================================

    event CollectionCreated(
        address collectionAddress,
        string name,
        string symbol
    );

    constructor(address initialAuth) AccessManaged(initialAuth) {

    }

    function createCollection(
        string memory name,
        string memory symbol,
        uint256 maximumSupply,
        address payable _SAFE
    ) external restricted {
        if (isNameExists(name)) {
            revert COLLECTION_NAME_ALREADY_EXISTS(name);
        } else if (isSymbolExists(symbol)) {
            revert COLLECTION_SYMBOL_ALREADY_EXISTS(symbol);
        }
        Copro collection = new Copro(address(this), name, symbol, maximumSupply, _SAFE); // index
        collections.push(collection);
        nbListedCollection++;
        emit CollectionCreated(address(collection), name, symbol);
    }

    function isNameExists(string memory name) public view returns (bool) {
        for (uint256 i = 0; i < nbListedCollection; i++) {
            if (
                keccak256(abi.encodePacked(collections[i].name)) ==
                keccak256(abi.encodePacked(name))
            ) {
                return true;
            }
        }
        return false;
    }

    function isSymbolExists(string memory symbol) public view returns (bool) {
        for (uint256 i = 0; i < nbListedCollection; i++) {
            if (
                keccak256(abi.encodePacked(collections[i].symbol)) ==
                keccak256(abi.encodePacked(symbol))
            ) {
                return true;
            }
        }
        return false;
    }

    function getCollectionById(uint256 index) public view returns (Copro) {
        return collections[index];
    }

    function getCollectionByName(
        string memory name
    ) public view returns (Copro) {
        for (uint256 i = 0; i < nbListedCollection; i++) {
            if (
                keccak256(abi.encodePacked(collections[i].name)) ==
                keccak256(abi.encodePacked(name))
            ) {
                return collections[i];
            }
        }
        revert COLLECTION_NOT_FOUND(name);
    }

    function getCollections() external view returns (Copro[] memory) {
        Copro[] memory _collections = new Copro[](nbListedCollection);
        for (uint256 i = 0; i < nbListedCollection; i++) {
            _collections[i] = collections[i];
        }
        return _collections;
    }
}
