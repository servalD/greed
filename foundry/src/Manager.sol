// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessManager} from "@openzeppelin/access/manager/AccessManager.sol";

contract Manager is AccessManager {

    // Role definitions
    

    constructor(address initialAdmin) AccessManager(initialAdmin){
        
    }
}
