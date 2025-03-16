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

        uint256 totalSupply = 3000;
        vm.prank(owner);
        ft = new FractionalToken("FractionalToken", "FT", coOwners, totalSupply);
    }

    function testInitialDistribution() public view {
        uint256 expectedShare = 3000 / 3;
        assertEq(ft.balanceOf(coOwner1), expectedShare, "coOwner1 n'a pas la bonne part");
        assertEq(ft.balanceOf(coOwner2), expectedShare, "coOwner2 n'a pas la bonne part");
        assertEq(ft.balanceOf(coOwner3), expectedShare, "coOwner3 n'a pas la bonne part");
    }

    function testMintByOwner() public {
        uint256 mintAmount = 100;
        vm.prank(owner);
        ft.mint(coOwner1, mintAmount);

        uint256 expected = (3000 / 3) + mintAmount;
        assertEq(ft.balanceOf(coOwner1), expected, "Mint par owner incorrect");
    }

    function testMintByNonOwnerReverts() public {
        vm.prank(coOwner1);
        vm.expectRevert();
        ft.mint(coOwner1, 100);
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

    function testListAllTokensForSaleSuccess() public {

        uint256 sellerInitialBalance = ft.balanceOf(coOwner1);
        uint256 pricePerTokenInput = 1;

        vm.prank(coOwner1);
        ft.listAllTokensForSale(pricePerTokenInput);

        (uint256 orderAmount, uint256 orderPrice) = ft.saleOrders(coOwner1);
        assertEq(orderAmount, sellerInitialBalance, "Listed amount must equal seller's balance");
        assertEq(orderPrice, pricePerTokenInput * 1 ether, "Price per token not converted correctly");

        assertEq(ft.balanceOf(coOwner1), 0, "Seller balance should be zero after listing");
    }

    function testListAllTokensForSaleRevertNoTokens() public {
        address emptyAccount = address(10);
        vm.prank(emptyAccount);
        vm.expectRevert(FractionalToken.NoTokenToList.selector);
        ft.listAllTokensForSale(1);
    }

    function testPurchaseAllTokensFromSellerSuccess() public {

        uint256 sellerInitialBalance = ft.balanceOf(coOwner1);
        uint256 pricePerTokenInput = 1;

        vm.prank(coOwner1);
        ft.listAllTokensForSale(pricePerTokenInput);


        uint256 totalPrice = sellerInitialBalance * 1 ether;

        uint256 buyerPayment = totalPrice + 0.1 ether;
        address buyer = address(11);
        vm.deal(buyer, 2000 ether);

        vm.prank(buyer);
        ft.purchaseAllTokensFromSeller{value: buyerPayment}(coOwner1);

        assertEq(ft.balanceOf(buyer), sellerInitialBalance, "Buyer must receive all tokens");

        (uint256 orderAmount, ) = ft.saleOrders(coOwner1);
        assertEq(orderAmount, 0, "Sale order must be deleted after purchase");
    }

    function testPurchaseAllTokensFromSellerRevertNoSaleActive() public {
        address seller = coOwner1;
        address buyer = address(11);
        vm.deal(buyer, 2000 ether);
        vm.prank(buyer);
        vm.expectRevert(FractionalToken.NoSaleActive.selector);
        ft.purchaseAllTokensFromSeller(seller);
    }

    function testPurchaseAllTokensFromSellerRevertInsufficientFunds() public {
        uint256 sellerInitialBalance = ft.balanceOf(coOwner1);
        uint256 pricePerTokenInput = 1; // 1 ether par token

        vm.prank(coOwner1);
        ft.listAllTokensForSale(pricePerTokenInput);

        uint256 totalPrice = sellerInitialBalance * 1 ether;

        address buyer = address(11);
        vm.deal(buyer, 2000 ether);
        vm.prank(buyer);
        vm.expectRevert(FractionalToken.InsufficientFunds.selector);
        ft.purchaseAllTokensFromSeller{value: totalPrice}(coOwner1);
    }

    function testCancelSaleOrderSuccess() public {
        uint256 sellerInitialBalance = ft.balanceOf(coOwner1);
        uint256 pricePerTokenInput = 1;

        vm.prank(coOwner1);
        ft.listAllTokensForSale(pricePerTokenInput);

        vm.prank(coOwner1);
        ft.cancelSaleOrder();

        (uint256 orderAmount, ) = ft.saleOrders(coOwner1);
        assertEq(orderAmount, 0, "Sale order must be deleted after cancellation");

        uint256 sellerBalanceAfter = ft.balanceOf(coOwner1);
        assertEq(sellerBalanceAfter, sellerInitialBalance, "Seller should recover tokens after cancellation");
    }

    function testCancelSaleOrderRevertNoSaleActive() public {
        vm.prank(coOwner1);
        vm.expectRevert();
        ft.cancelSaleOrder();
    }

    function testMintByOwnerSuccess() public {
        uint256 initialBalance = ft.balanceOf(coOwner1);
        uint256 mintAmount = 100;
        vm.prank(owner);
        ft.mint(coOwner1, mintAmount);
        assertEq(ft.balanceOf(coOwner1), initialBalance + mintAmount, "Mint did not increase balance correctly");
    }

    function testMintByNonOwnerRevert() public {
        vm.prank(coOwner1);
        vm.expectRevert();
        ft.mint(coOwner1, 100);
    }
}
