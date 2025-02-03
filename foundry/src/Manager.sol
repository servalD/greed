// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AccessManager} from "@openzeppelin/access/manager/AccessManager.sol";
import {Agency} from "./Agency.sol";
import {Copro} from "./Copro.sol";
import {IRoleDefinition} from "./IRoleDefinition.sol";

contract Manager is AccessManager {
    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    /**
     * @dev Initializes the Manager contract and sets up role administrators.
     * @param initialAdmin Address of the initial admin.
     */
    constructor(address initialAdmin) AccessManager(initialAdmin) {
        // As it's the agency that makes calls (as msg.sender), it's the agency that grants roles
        _setRoleAdmin(IRoleDefinition.CLIENT_ROLE, IRoleDefinition.AGENCY_ROLE);
        _setRoleAdmin(
            IRoleDefinition.CO_OWNER_ROLE,
            IRoleDefinition.AGENCY_ROLE
        );
        _setRoleAdmin(IRoleDefinition.AGENT_ROLE, IRoleDefinition.AGENCY_ROLE);
    }

    // =============================================================
    //                          FUNCTIONS
    // =============================================================

    /**
     * @notice Adds an agency to the system and assigns roles and permissions for its operations.
     * @param agency Address of the agency contract.
     */
    function addAgency(address agency) public {
        _grantRole(IRoleDefinition.AGENCY_ROLE, agency, 0, 0); // Agency is granted AGENCY_ROLE
        _setTargetFunctionRole(
            agency,
            Agency.hireAgent.selector,
            IRoleDefinition.AGENT_ROLE
        ); // Agent can hire agent
        _setTargetFunctionRole(agency, Agency.hireAgent.selector, ADMIN_ROLE); // Admin can hire agent (as it's the deployer and entry point for agent)
        _setTargetFunctionRole(
            agency,
            Agency.acceptClient.selector,
            IRoleDefinition.AGENT_ROLE
        ); // Agent can accept client
        _setTargetFunctionRole(
            agency,
            Agency.createCopro.selector,
            IRoleDefinition.AGENT_ROLE
        ); // Agent can create copro
    }

    /**
     * @notice Adds an agent to the system and assigns them the AGENT_ROLE.
     * @param agent Address of the agent.
     */
    function addAgent(address agent) public {
        _grantRole(IRoleDefinition.AGENT_ROLE, agent, 0, 0); // Agent is granted AGENT_ROLE
    }

    /**
     * @notice Configures a co-property and assigns permissions for its `buy` function.
     * @param copro Address of the co-property contract.
     */
    function addCopro(address copro) public {
        _setTargetFunctionRole(
            copro,
            Copro.buy.selector,
            IRoleDefinition.CLIENT_ROLE
        );
    }
}
