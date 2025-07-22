// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/utils/structs/EnumerableSet.sol";
import "@openzeppelin/utils/structs/EnumerableMap.sol";
import {Copro} from "./Copro.sol";
import {AccessManaged} from "@openzeppelin/access/manager/AccessManaged.sol";
import {Manager} from "./Manager.sol";
import {IRoleDefinition} from "./IRoleDefinition.sol";

contract Agency is AccessManaged {
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
    error NotInGuestList();

    // =============================================================
    //                          STATE VARIABLES
    // =============================================================

    uint256 public nbListedCopro;

    address private immutable SAFE;

    EnumerableSet.AddressSet private guestList; // Incoming guest (to be validated by the agent and then able to buy flat)
    EnumerableSet.AddressSet private clientList; // List of clients (validated guests)

    // =============================================================
    //                            STRUCTS
    // =============================================================

    Copro[] public copros; // List of available co properties (deployed)

    // =============================================================
    //                            EVENTS
    // =============================================================

    event ClientAccepted(address indexed client); // guestList address converted to Client (through the access manager)
    event GuestRefused(address indexed guest);

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    constructor(
        Manager _manager,
        address safe
    ) AccessManaged(address(_manager)) {
        manager = _manager;
        manager.addAgency(address(this));
        SAFE = safe;
    }

    // =============================================================
    //                          FUNCTIONS
    // =============================================================
    /**
     * @notice Assigns an agent role to an address.
     * @dev Restricted to AccessManager Admin and other agent.
     * @param _agent Address to be assigned as an agent.
     */
    function hireAgent(address _agent) external restricted {
        // Only deployer
        manager.addAgent(_agent);
    }

    /**
     * @notice Adds the caller to the guest list.
     * @dev Guests are validated later to become clients. Reverts if the caller is already a client.
     */
    function GuestEntrance() public {
        (bool isClient, ) = manager.hasRole(
            IRoleDefinition.CLIENT_ROLE,
            msg.sender
        );
        if (isClient) {
            revert AlreadyClient();
        }
        guestList.add(msg.sender);
    }

    /**
     * @notice Returns the list of guests.
     * @return List of guest addresses.
     */
    function guests() public view returns (address[] memory) {
        return guestList.values();
    }

    /**
     * @notice Accepts a guest as a client and grants them the client role.
     * @dev Restricted to agents. Removes the guest from the guest list.
     * @param _client Address of the guest to be accepted as a client.
     */
    function acceptClient(address _client) external restricted {
        manager.grantRole(IRoleDefinition.CLIENT_ROLE, _client, 0);
        guestList.remove(_client);
        clientList.add(_client);
        emit ClientAccepted(_client);
    }

    /**
     * @notice Refuses a guest as a client and remove them from the list.
     * @dev Restricted to agents. Removes the guest from the guest list.
     * @param _guest Address of the guest to be refused as a client.
     */
    function refuseCLient(address _guest) external restricted {
        if (!guestList.contains(_guest)) revert NotInGuestList();
        guestList.remove(_guest);
        emit GuestRefused(_guest);
    }

    /**
     * @notice Revokes the client role from an address.
     * @dev Restricted to agents. Removes the client from the client list.
     * @param _client Address of the client to be revoked.
     */
    function revokeClient(address _client) external restricted {
        manager.revokeRole(IRoleDefinition.CLIENT_ROLE, _client);
        clientList.remove(_client);
    }

    /**
     * @notice Returns the list of clients.
     * @return List of client addresses.
     */
    function clients() public view returns (address[] memory) {
        return clientList.values();
    }

    /**
     * @notice Creates a new co-property contract.
     * @param name Name of the co-property.
     * @param symbol Symbol representing the co-property.
     * @param flatCount Number of flats in the co-property.
     * @param promoter Address of the promoter.
     */
    function createCopro(
        string memory name,
        string memory symbol,
        uint96 flatCount,
        address promoter,
        string memory imageURL
    ) external returns (Copro) {
        Copro copro = new Copro(
            manager,
            promoter,
            name,
            symbol,
            flatCount,
            payable(SAFE),
            imageURL
        ); // index
        copros.push(copro);
        nbListedCopro++;

        // Role assignment
        manager.addCopro(address(copro));

        return copro;
    }

    // That's up to the front end to handle the search as copros is public (to lower gas cost at deployment) Or not...

    function getCoproById(uint256 index) public view returns (Copro) {
        return copros[index];
    }

    function getCoproByName(string memory name) public view returns (Copro) {
        // Unable to detect missing branch in test coverage !!!
        bytes32 encodedName = keccak256(abi.encodePacked(name));
        for (uint256 i = 0; i < nbListedCopro; i++) {
            bytes32 encodedCoproName = keccak256(
                abi.encodePacked(copros[i].name())
            );
            if (encodedCoproName == encodedName) {
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
