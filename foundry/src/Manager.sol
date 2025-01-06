// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AccessManager} from "@openzeppelin/access/manager/AccessManager.sol";
import {Agency} from "./Agency.sol";
import {Copro} from "./Copro.sol";
import {IRoleDefinition} from "./IRoleDefinition.sol";


contract Manager is AccessManager, IRoleDefinition {
    

    constructor(address initialAdmin) AccessManager(initialAdmin){
        // As it's the agency that makes calls (as msg.sender), it's the agency that grants roles
        _setRoleAdmin(CLIENT_ROLE, AGENCY_ROLE);
        _setRoleAdmin(CO_OWNER_ROLE, AGENCY_ROLE);
        _setRoleAdmin(AGENT_ROLE, AGENCY_ROLE);
    }

    function addAgency(address agency) public {
        _grantRole(AGENCY_ROLE, agency, 0, 0);// Agency is granted AGENCY_ROLE
        _setTargetFunctionRole(agency, Agency.hireAgent.selector, AGENT_ROLE);// Agent can hire agent
        _setTargetFunctionRole(agency, Agency.hireAgent.selector, ADMIN_ROLE);// Admin can hire agent (as it's the deployer and entry point for agent)
        _setTargetFunctionRole(agency, Agency.acceptClient.selector, AGENT_ROLE);// Agent can accept client
        _setTargetFunctionRole(agency, Agency.createCopro.selector, AGENT_ROLE);// Agent can create copro
        
    }

    function addAgent(address agent) public {
        _grantRole(AGENT_ROLE, agent, 0, 0);// Agent is granted AGENT_ROLE
    }

    function addCopro(address copro) public {
        _setTargetFunctionRole(copro, Copro.buy.selector, CLIENT_ROLE);
    }
    
}
