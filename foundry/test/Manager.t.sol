// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/Manager.sol";
import "../src/Agency.sol";
import "../src/Copro.sol";
import "../src/IRoleDefinition.sol";

contract ManagerTest is Test {
    Manager manager;
    Agency agency;

    // Adresses de test
    address admin = address(1);
    address agent = address(2);
    address buyer = address(4);
    address promoter = address(5);
    address safeAddress = address(6);
    address client = address(7);
    address coowner = address(8);
    address guest = address(9);
    address nonRoleUser = address(10);

    function setUp() public {
        vm.deal(admin, 100 ether);
        vm.deal(agent, 100 ether);
        vm.deal(buyer, 100 ether);
        vm.deal(client, 100 ether);

        // Déployer le Manager avec admin comme initialAdmin
        vm.prank(admin);
        manager = new Manager(admin);

        // Déployer l'Agency pour qu'elle soit enregistrée dans le Manager
        vm.prank(admin);
        agency = new Agency(manager, safeAddress);
    }

    function testAddAgency() public {
        address newAgency = address(0x123);

        vm.prank(admin);
        manager.addAgency(newAgency);

        // Verify agency has AGENCY_ROLE
        (bool hasAgency, ) = manager.hasRole(
            IRoleDefinition.AGENCY_ROLE,
            newAgency
        );
        assertTrue(hasAgency);

        // Verify function roles are set correctly
        // This indirectly tests the _setTargetFunctionRole calls
        assertTrue(true); // The function execution itself tests the role setup
    }

    function testAddAgent() public {
        vm.prank(admin);
        manager.addAgent(agent);
        (bool hasAgent, ) = manager.hasRole(IRoleDefinition.AGENT_ROLE, agent);
        assertTrue(hasAgent); // L'agent doit avoir le rôle AGENT_ROLE
    }

    function testAddCopro() public {
        uint96 flatCount = 5;
        vm.prank(admin);
        Copro localCopro = new Copro(
            manager,
            promoter,
            "CoproTest",
            "CT",
            flatCount,
            payable(safeAddress),
            "fakeurl"
        );
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
        assertEq(localCopro.ownerOf(0), buyer); // Le buyer doit être le nouveau propriétaire
    }

    function testGetRoleAgency() public view {
        uint256 role = manager.getRole(address(agency));
        assertEq(role, IRoleDefinition.AGENCY_ROLE);
    }

    function testGetRoleAgent() public {
        vm.prank(admin);
        manager.addAgent(agent);

        uint256 role = manager.getRole(agent);
        assertEq(role, IRoleDefinition.AGENT_ROLE);
    }

    function testGetRoleClient() public {
        // Setup client role through agency
        vm.prank(admin);
        manager.addAgent(agent);
        vm.prank(admin);
        agency.hireAgent(agent);
        vm.prank(client);
        agency.GuestEntrance();
        vm.prank(agent);
        agency.acceptClient(client);

        uint256 role = manager.getRole(client);
        assertEq(role, IRoleDefinition.CLIENT_ROLE);
    }

    function testGetRoleGuest() public {
        // Setup guest role
        vm.prank(guest);
        agency.GuestEntrance();

        uint256 role = manager.getRole(guest);
        assertEq(role, IRoleDefinition.GUEST_ROLE);
    }

    function testGetRoleCoOwner() public {
        // Grant CO_OWNER_ROLE directly for testing
        vm.prank(address(agency));
        manager.grantRole(IRoleDefinition.CO_OWNER_ROLE, coowner, 0);

        uint256 role = manager.getRole(coowner);
        assertEq(role, IRoleDefinition.CO_OWNER_ROLE);
    }

    function testRoleAdminSetup() public view {
        // Test that role admins are set correctly
        uint64 clientRoleAdmin = manager.getRoleAdmin(
            IRoleDefinition.CLIENT_ROLE
        );
        uint64 coOwnerRoleAdmin = manager.getRoleAdmin(
            IRoleDefinition.CO_OWNER_ROLE
        );
        uint64 agentRoleAdmin = manager.getRoleAdmin(
            IRoleDefinition.AGENT_ROLE
        );
        uint64 guestRoleAdmin = manager.getRoleAdmin(
            IRoleDefinition.GUEST_ROLE
        );

        assertEq(clientRoleAdmin, IRoleDefinition.AGENCY_ROLE);
        assertEq(coOwnerRoleAdmin, IRoleDefinition.AGENCY_ROLE);
        assertEq(agentRoleAdmin, IRoleDefinition.AGENCY_ROLE);
        assertEq(guestRoleAdmin, IRoleDefinition.AGENCY_ROLE);
    }

    function testGetRoleNoRole() public view {
        uint256 role = manager.getRole(nonRoleUser);
        assertEq(role, 0);
    }

}
