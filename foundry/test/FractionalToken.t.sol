// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/FractionalToken.sol";
import "@openzeppelin/token/ERC721/IERC721Receiver.sol";

contract FractionalTokenTest is Test {
    FractionalToken ft;
    address owner;
    address coOwner1;
    address coOwner2;
    address coOwner3;

    // Déclaration de l'événement pour vérifier l'émission
    event ReceivedNFT(address operator, address from, uint256 tokenId, bytes data);

    function setUp() public {
        owner = address(1);
        coOwner1 = address(2);
        coOwner2 = address(3);
        coOwner3 = address(4);

        address[] memory coOwners = new address[](3);
        coOwners[0] = coOwner1;
        coOwners[1] = coOwner2;
        coOwners[2] = coOwner3;

        uint256 totalSupply = 3000 ether;

        vm.prank(owner);
        ft = new FractionalToken("FractionalToken", "FT", coOwners, totalSupply);
    }

    function testInitialDistribution() public view {
        uint256 expectedShare = 3000 ether / 3;
        assertEq(ft.balanceOf(coOwner1), expectedShare, "coOwner1 n'a pas la bonne part");
        assertEq(ft.balanceOf(coOwner2), expectedShare, "coOwner2 n'a pas la bonne part");
        assertEq(ft.balanceOf(coOwner3), expectedShare, "coOwner3 n'a pas la bonne part");
    }

    function testMintByOwner() public {
        uint256 mintAmount = 100 ether;
        vm.prank(owner);
        ft.mint(coOwner1, mintAmount);

        uint256 expected = (3000 ether / 3) + mintAmount;
        assertEq(ft.balanceOf(coOwner1), expected, "Mint par owner incorrect");
    }

    function testMintByNonOwnerReverts() public {
        vm.prank(coOwner1);
        vm.expectRevert();
        ft.mint(coOwner1, 100 ether);
    }

    function testOnERC721Received() public {
        address operator = address(100);
        address from = address(101);
        uint256 tokenId = 1;
        bytes memory data = "test";

        vm.expectEmit(true, true, true, true);
        emit ReceivedNFT(operator, from, tokenId, data);
        bytes4 retval = ft.onERC721Received(operator, from, tokenId, data);
        assertEq(retval, IERC721Receiver.onERC721Received.selector, "Selecteur retourne incorrect");
    }
}
