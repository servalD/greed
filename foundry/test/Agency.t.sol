// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import "../src/Agency.sol";
import "../src/Manager.sol";
import "../src/Copro.sol";

contract AgencyTest is Test, IRoleDefinition {
    Agency agency;
    Manager manager;
    address promoter = address(0x123);
    address deployer = address(0x136);
    address agent = address(0x246);
    address payable safe = payable(address(0x456));
    address guest = address(0x789);
    uint96 flatCount = 10;

    function setUp() public {
        manager = new Manager(deployer);
        agency = new Agency(manager);
    }

    function testConstructor() public view {
        (bool hasAdminRole, ) = manager.hasRole(manager.ADMIN_ROLE(), address(deployer));
        assert(hasAdminRole);
        (bool hasAgencyRole, ) = manager.hasRole(AGENCY_ROLE, address(agency));
        assert(hasAgencyRole);
        
    }

    function testHireAgent() public {
        vm.prank(deployer);
        agency.hireAgent(agent);
        (bool isAgent, ) = manager.hasRole(AGENT_ROLE, agent);
        assert(isAgent);
    }

    function testGuestEntrance() public {
        vm.prank(guest);
        agency.GuestEntrance();
        address[] memory guests = agency.guests();
        assertEq(guests[0], guest);
    }

    function testAcceptClient() public {
        testGuestEntrance();
        testHireAgent();
        vm.prank(agent);
        agency.acceptClient(guest);
        address[] memory guests = agency.guests();
        assertEq(guests.length, 0);
        (bool isClient, ) = manager.hasRole(CLIENT_ROLE, guest);
        assert(isClient);
    }

    function testCreateCopro() public {
        string memory name = "CoproToken";
        string memory symbol = "CTK";
        vm.prank(address(this));
        agency.createCopro(name, symbol, flatCount, safe, promoter);
        Copro copro = agency.copros(0);
        assertEq(copro.name(), name);
        assertEq(copro.symbol(), symbol);
    }

    // function testGetCoproById() public {
    //     string memory name = "CoproToken";
    //     string memory symbol = "CTK";
    //     vm.prank(address(this));
    //     agency.createCopro(name, symbol, flatCount, safe, promoter);
    //     Copro copro = agency.getCoproById(0);
    //     assertEq(copro.name(), name);
    // }

    // function testGetCoproByName() public {
    //     string memory name = "CoproToken";
    //     string memory symbol = "CTK";
    //     vm.prank(address(this));
    //     agency.createCopro(name, symbol, flatCount, safe, promoter);
    //     Copro copro = agency.getCoproByName(name);
    //     assertEq(copro.name(), name);
    // }

    // function testGetCopros() public {
    //     string memory name1 = "CoproToken1";
    //     string memory symbol1 = "CTK1";
    //     string memory name2 = "CoproToken2";
    //     string memory symbol2 = "CTK2";
    //     vm.prank(address(this));
    //     agency.createCopro(name1, symbol1, flatCount, safe, promoter);
    //     vm.prank(address(this));
    //     agency.createCopro(name2, symbol2, flatCount, safe, promoter);
    //     Copro[] memory copros = agency.getCopros();
    //     assertEq(copros.length, 2);
    //     assertEq(copros[0].name(), name1);
    //     assertEq(copros[1].name(), name2);
    // }
}
