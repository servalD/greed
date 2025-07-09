// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/Agency.sol";
import "../src/Copro.sol";
import "../src/Manager.sol";
import "../src/IRoleDefinition.sol";

contract AgencyTest is Test {
    Manager manager;
    Agency agency;

    // Adresses de test
    address admin = address(1);
    address agent = address(2);
    address guest = address(3);
    address promoter = address(5);
    address safeAddress = address(6);

    function setUp() public {
        vm.deal(admin, 100 ether);
        vm.deal(agent, 100 ether);
        vm.deal(guest, 100 ether);

        // Déployer le Manager avec admin comme initialAdmin
        vm.prank(admin);
        manager = new Manager(admin);

        // Déployer l'Agency en lui passant le Manager
        vm.prank(admin);
        agency = new Agency(manager, safeAddress);
    }

    function testHireAgent() public {
        // L'admin (ayant ADMIN_ROLE) embauche un agent
        vm.prank(admin);
        agency.hireAgent(agent);
        (bool hasAgent, ) = manager.hasRole(IRoleDefinition.AGENT_ROLE, agent);
        assertTrue(hasAgent); // L'agent doit avoir le rôle AGENT_ROLE
    }

    function testGuestEntrance() public {
        // Un guest entre (il n'est pas client) → succès
        vm.prank(guest);
        agency.GuestEntrance();
        address[] memory gs = agency.guests();
        bool found;
        for (uint256 i = 0; i < gs.length; i++) {
            if (gs[i] == guest) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }

    function testAcceptClient() public {
        vm.prank(admin);
        agency.hireAgent(agent);
        // Ajouter un guest puis l'accepter
        vm.prank(guest);
        agency.GuestEntrance();
        vm.prank(agent);
        agency.acceptClient(guest);

        // Vérifier que le guest a été retiré de la liste
        address[] memory gs = agency.guests();
        bool found;
        for (uint256 i = 0; i < gs.length; i++) {
            if (gs[i] == guest) {
                found = true;
                break;
            }
        }
        assertFalse(found); // Le guest doit être retiré de la liste
        // Vérifier que le rôle CLIENT_ROLE a été attribué
        (bool isClient, ) = manager.hasRole(IRoleDefinition.CLIENT_ROLE, guest);
        assertTrue(isClient); // Le guest doit être client
    }

    function testGuestEntranceAndAlreadyClient() public {
        vm.prank(guest);
        agency.GuestEntrance();

        vm.prank(admin);
        agency.hireAgent(agent);

        vm.prank(agent);
        agency.acceptClient(guest);

        // S'il est déjà client, l'appel doit reverter
        vm.prank(guest);
        vm.expectRevert(Agency.AlreadyClient.selector);
        agency.GuestEntrance();
    }

    function testCreateAndGetCopro() public {
        string memory name = "TestCopro";
        string memory symbol = "TC";
        string memory imageURL = "";
        uint96 flatCount = 5;
        vm.prank(admin);
        agency.createCopro(name, symbol, flatCount, promoter, imageURL);
        assertEq(agency.nbListedCopro(), 1); // Il doit y avoir 1 copro créé

        // Vérifier les getters
        Copro created = agency.getCoproById(0);
        assertEq(created.name(), name); // Le nom doit correspondre
        assertEq(created.symbol(), symbol); // Le symbol doit correspondre
        Copro byName = agency.getCoproByName(name);
        assertEq(address(created), address(byName)); // Les deux copros doivent être les mêmes
        // Vérifier que getCoproByName reverte pour un nom inexistant
        vm.expectRevert(
            abi.encodeWithSelector(
                Agency.COLLECTION_NOT_FOUND.selector,
                "NonExisting"
            )
        );
        agency.getCoproByName("NonExisting");

        Copro[] memory allCopros = agency.getCopros();
        assertEq(allCopros.length, 1); // Il doit y avoir 1 copro
        assertEq(address(allCopros[0]), address(created)); // La copro récupéré doit correspondre à celui créé
    }
}
