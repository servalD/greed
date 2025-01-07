// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/utils/structs/EnumerableSet.sol";
import "@openzeppelin/utils/structs/EnumerableMap.sol";
import {Copro} from "./Copro.sol";
import {AccessManaged} from "@openzeppelin/access/manager/AccessManaged.sol";
import {Manager} from "./Manager.sol";
import {IRoleDefinition} from "./IRoleDefinition.sol";

contract Agency is AccessManaged, IRoleDefinition {
    Manager manager;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.Bytes32Set;
    // =============================================================
    //                            ERRORS
    // =============================================================

    error COLLECTION_NOT_FOUND(string);

    error COLLECTION_NAME_ALREADY_EXISTS(string);

    error COLLECTION_SYMBOL_ALREADY_EXISTS(string);

    error AlreadyClient();

    // =============================================================
    //                     COLLECTION'S COUNTER
    // =============================================================

    uint256 public nbListedCopro;

    // =============================================================
    //                            STRUCTS
    // =============================================================

    ///////////////////////// PROPERTIES /////////////////////////

    Copro[] public copros;// List of available co properties (deployed)

    ///////////////////////// GUEST AND CLIENTS //////////////////
    EnumerableSet.AddressSet private guestList;// Incoming guest (to be validated by the agent and then able to buy flat)
    // No need to keep track of clients (handled by the access manager)

    // =============================================================
    //                            EVENTS
    // =============================================================

    event ClientAccepted(address indexed client);// guestList address converted to Client (through the access manager)

    constructor(Manager _manager) AccessManaged(address(_manager)){
        manager = _manager;
        manager.addAgency(address(this));
    }

    function hireAgent(address _agent) external restricted {// Only deployer
        manager.addAgent(_agent);
    }

    // Guest to client process (operated by agents)
    function GuestEntrance() public {
        (bool isClient, uint32 delay) = manager.hasRole(CLIENT_ROLE, msg.sender);
        if (isClient) {
            revert AlreadyClient();
        }
        guestList.add(msg.sender);
    }

    function guests() public view returns (address[] memory) {
        return guestList.values();
    }

    function acceptClient(address _client) external restricted {// Only agents
        guestList.remove(_client);
        manager.grantRole(CLIENT_ROLE, _client, 0);
        emit ClientAccepted(_client);
    }

    function createCopro(
        
        string memory name,
        string memory symbol,
        uint96 flatCount,
        address _SAFE,
        address promoter
    ) external {
        Copro copro = new Copro(manager, promoter, name, symbol, flatCount, payable(_SAFE)); // index
        copros.push(copro);
        nbListedCopro++;

        // Role assignment
        manager.addCopro(address(copro));
        
    }

    function getCoproById(uint256 index) public view returns (Copro) {
        return copros[index];
    }

    function getCoproByName(
        string memory name
    ) public view returns (Copro) {
        for (uint256 i = 0; i < nbListedCopro; i++) {
            if (
                keccak256(abi.encodePacked(copros[i].name())) ==
                keccak256(abi.encodePacked(name))
            ) {
                return copros[i];
            }
        }
        revert COLLECTION_NOT_FOUND(name);
    }

    function getCopros() external view returns (Copro[] memory) {
        Copro[] memory _copros = new Copro[](nbListedCopro);
        for (uint256 i = 0; i < nbListedCopro; i++) {
            _copros[i] = copros[i];
        }
        return _copros;
    }
}
