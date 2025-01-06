// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/Copro.sol";
import "@openzeppelin/access/manager/AccessManager.sol";

contract Manager is AccessManager, IRoleDefinition {
    
    constructor(address initialAdmin) AccessManager(initialAdmin){
        // _setRoleAdmin(ADMIN_ROLE, CLIENT_ROLE);
    }

    function addCopro(address copro) public {
        _setTargetFunctionRole(copro, Copro.buy.selector, CLIENT_ROLE);
    }
    
}

contract CoproTest is Test, IRoleDefinition {
    Copro copro;
    Manager manager;
    address promoter = address(0x123);
    address deployer = address(0x456);
    address payable safe = payable(address(0x456));
    uint96 flatCount = 10;

    function setUp() public {
        emit log_address(msg.sender);
        manager = new Manager(deployer);
        copro = new Copro(manager, promoter, "CoproToken", "CTK", flatCount, safe);
        vm.prank(deployer);
        manager.addCopro(address(copro));
    }

    function testMinting() public {
        for (uint256 i = 0; i < flatCount; i++) {
            assertEq(copro.ownerOf(i), promoter);
        }
    }

    function testSell() public {
        uint256 tokenId = 1;
        uint256 amount = 1 ether;
        vm.prank(promoter);
        copro.sell(tokenId, amount);
        assertEq(copro.market(tokenId), amount);
    }

    function testCancelSale() public {
        uint256 tokenId = 1;
        uint256 amount = 1 ether;
        vm.prank(promoter);
        copro.sell(tokenId, amount);
        vm.prank(promoter);
        copro.cancelSale(tokenId);
        assertEq(copro.market(tokenId), 0);
    }

    function testBuy() public {
        uint256 tokenId = 1;
        uint256 amount = 1 ether;
        address buyer = address(0x789);
        vm.prank(promoter);
        copro.sell(tokenId, amount);
        vm.deal(buyer, amount);
        vm.prank(buyer);
        vm.expectRevert();
        copro.buy{value: amount}(tokenId);
        // Set the client role to the buyer
        vm.prank(deployer);
        manager.grantRole(CLIENT_ROLE, buyer, 0);
        vm.prank(buyer);
        copro.buy{value: amount}(tokenId);
        assertEq(copro.ownerOf(tokenId), buyer);
        assertEq(copro.market(tokenId), 0);
    }
}
