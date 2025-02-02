// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {Agency} from "../src/Agency.sol";
import {Manager} from "../src/Manager.sol";
import {Copro} from "../src/Copro.sol";

contract DemoScript is Script {
  // DemoScript to setup the environment for the blockchain architecture demo
  Manager public manager;
  Agency public agency;

  address payable safe = payable(vm.envAddress("SAFE_ADDRESS"));

  uint256 adminPk = vm.envUint("ADMIN_PRIVATE_KEY");
  address admin = vm.addr(vm.envUint("ADMIN_PRIVATE_KEY"));

  uint256 agentPk = vm.envUint("AGENT_PRIVATE_KEY");
  address agent = vm.addr(vm.envUint("AGENT_PRIVATE_KEY"));

  uint256 promoterPk = vm.envUint("PROMOTER_PRIVATE_KEY");
  address promoter = vm.addr(vm.envUint("PROMOTER_PRIVATE_KEY"));

  function run() public {
      vm.startBroadcast(adminPk);
      
      manager = new Manager(admin);

      agency = new Agency(manager, safe);

      console.log("Admin address: ", address(admin));
      console.log("Manager address: ", address(manager));
      console.log("Agency address: ", address(agency));

      agency.hireAgent(agent);

      console.log("Agent address: ", agent);

      vm.stopBroadcast();
      vm.startBroadcast(agentPk);

      Copro sepoliaCopro = agency.createCopro("Long Court", "LC", 10, promoter);

      console.log("Sepolia Copro address: ", address(sepoliaCopro));

      vm.stopBroadcast();
      vm.startBroadcast(promoterPk);

      console.log("Promoter address: ", promoter);
      for (uint96 i = 0; i < 10; i++) {
        uint price = (0.0001 ether) + (i * 0.0001 ether);
        sepoliaCopro.sell(i, price);
      }

      vm.stopBroadcast();

  }
}
