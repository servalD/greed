// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Agency} from "../src/Agency.sol";
// import {Manager} from "../src/Manager.sol";

// contract FactoryScript is Script {
//     // Manager public manager;
//     Agency public agency;
//     address payable safe = payable(0x2eE342756969fe6a32c1990b7D9347c52e971b1C);
//     function setUp() public {}

//     function run() public {
//         vm.startBroadcast();

//         // manager = new Manager(msg.sender);

//         agency = new Agency(msg.sender);

//         agency.createCollection("Long Court", "LC", 20, safe);

//         vm.stopBroadcast();

//     }
// }
