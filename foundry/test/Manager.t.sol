// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/Manager.sol";
import "../src/Agency.sol";
import "../src/Copro.sol";
import "../src/IRoleDefinition.sol";

contract ManagerTest is Test, IRoleDefinition {

    Manager manager;
    Agency agency;

    // Adresses de test
    address admin = address(1);
    address agent = address(2);
    address buyer = address(4);
    address promoter = address(5);
    address safeAddress = address(6);

    function setUp() public {
        vm.deal(admin, 100 ether);
        vm.deal(agent, 100 ether);
        vm.deal(buyer, 100 ether);

        // Déployer le Manager avec admin comme initialAdmin
        vm.prank(admin);
        manager = new Manager(admin);

        // Déployer l'Agency pour qu'elle soit enregistrée dans le Manager
        vm.prank(admin);
        agency = new Agency(manager, safeAddress);
    }

    function testAddAgency() public view {
        // Dès le déploiement, l'Agency doit avoir le rôle AGENCY_ROLE
        (bool hasAgency, ) = manager.hasRole(AGENCY_ROLE, address(agency));
        assertTrue(hasAgency);// L'Agency doit avoir le rôle AGENCY_ROLE  
    }

    function testAddAgent() public {
        vm.prank(admin);
        manager.addAgent(agent);
        (bool hasAgent, ) = manager.hasRole(AGENT_ROLE, agent);
        assertTrue(hasAgent);// L'agent doit avoir le rôle AGENT_ROLE
    }

    function testAddCopro() public {
        uint96 flatCount = 5;
        vm.prank(admin);
        Copro localCopro = new Copro(manager, promoter, "CoproTest", "CT", flatCount, payable(safeAddress));
        vm.prank(admin);
        manager.addCopro(address(localCopro));

        // Sans mise en vente, l'achat doit reverter par FlatNotForSale
        vm.deal(buyer, 10 ether);
        vm.prank(admin);
        agency.hireAgent(agent);
        vm.prank(buyer);
        agency.GuestEntrance();
        vm.prank(agent);
        agency.acceptClient(buyer);

        vm.prank(buyer);
        vm.expectRevert(Copro.FlatNotForSale.selector);
        localCopro.buy{value: 1 ether}(0);

        // Maintenant, mettre le token en vente et acheter
        vm.prank(promoter);
        localCopro.sell(0, 1 ether);
        vm.prank(buyer);
        localCopro.buy{value: 1 ether}(0);
        assertEq(localCopro.ownerOf(0), buyer);// Le buyer doit être le nouveau propriétaire
    }
}
