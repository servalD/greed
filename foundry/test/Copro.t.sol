// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/Copro.sol";
import "../src/Manager.sol";
import "../src/IRoleDefinition.sol";

contract CoproTest is Test, IRoleDefinition {

    Manager manager;
    address admin = address(1);
    address promoter = address(5);
    address buyer = address(4);
    address safeAddress = address(6);

    function setUp() public {
        vm.deal(admin, 100 ether);
        vm.deal(buyer, 100 ether);
        vm.prank(admin);
        manager = new Manager(admin);
        vm.prank(admin);
        manager.grantRole(AGENCY_ROLE, admin, 0);
    }

    // Fonction interne pour déployer une Copro valide
    function deployCopro(uint96 _flatCount) internal returns (Copro) {
        vm.prank(admin);
        Copro localCopro = new Copro(manager, promoter, "CoproTest", "CT", _flatCount, payable(safeAddress));
        vm.prank(admin);
        manager.addCopro(address(localCopro));
        return localCopro;
    }

    function testCoproConstructorInvalidFlatCount() public {
        vm.prank(admin);
        vm.expectRevert(Copro.InvalidFlatCount.selector);
        new Copro(manager, promoter, "CoproTest", "CT", 0, payable(safeAddress));
    }

    function testSellAndCancelSale() public {
        uint96 flatCount = 5;
        Copro localCopro = deployCopro(flatCount);
        uint256 price = 1 ether;
        // Le promoteur (propriétaire) met en vente le token 0
        vm.prank(promoter);
        localCopro.sell(0, price);
        assertEq(localCopro.market(0), price);// Le token 0 doit être en vente à price

        vm.prank(promoter);
        localCopro.cancelSale(0);
        assertEq(localCopro.market(0), 0);// Le token 0 ne doit plus être en vente
    }

    function testBuyStandard() public {
        uint96 flatCount = 5;
        Copro localCopro = deployCopro(flatCount);
        uint256 price = 1 ether;
        // Le promoteur met en vente le token 0
        vm.prank(promoter);
        localCopro.sell(0, price);
        // Attribution du rôle CLIENT_ROLE à buyer
        vm.prank(admin);
        manager.grantRole(CLIENT_ROLE, buyer, 0);
        vm.deal(buyer, 10 ether);

        uint256 safeBalanceBefore = safeAddress.balance;
        uint256 buyerBalanceBefore = buyer.balance;
        uint256 promoterBalanceBefore = promoter.balance;
        
        vm.prank(buyer);
        localCopro.buy{value: price}(0);

        // Vérifier que le token 0 a bien été transféré à buyer
        assertEq(localCopro.ownerOf(0), buyer);// Buyer doit être le nouveau propriétaire
        // Le token ne doit plus être en vente
        assertEq(localCopro.market(0), 0);// Le token 0 ne doit plus être en vente

        // Vérifier l'historique de la vente
        (address histAddr, uint256 histAmount) = localCopro.history(0, 0);
        assertEq(histAddr, buyer);// L'historique doit indiquer l'acheteur
        assertEq(histAmount, price);// L'historique doit indiquer le montant de la vente

        // Vérifier le transfert des fonds : frais de 2%
        uint256 fee = price * 2 / 100;
        uint256 safeBalanceAfter = safeAddress.balance;
        uint256 buyerBalanceAfter = buyer.balance;
        uint256 promoterBalanceAfter = promoter.balance;

        assertEq(safeBalanceAfter, safeBalanceBefore + fee);// Le SAFE doit recevoir les frais
        assertEq(buyerBalanceAfter, buyerBalanceBefore - price);// Buyer doit payer les frais et le prix du token
        assertEq(promoterBalanceAfter, promoterBalanceBefore + price - fee);// Le promoteur doit pas recevoir de fonds
    }

    function testBuyRevertNotForSale() public {
        uint96 flatCount = 5;
        Copro localCopro = deployCopro(flatCount);
        vm.prank(admin);
        manager.grantRole(CLIENT_ROLE, buyer, 0);
        vm.deal(buyer, 10 ether);
        vm.prank(buyer);
        vm.expectRevert(Copro.FlatNotForSale.selector);
        localCopro.buy{value: 1 ether}(0);
    }

    function testBuyRevertInvalidAmount() public {
        uint96 flatCount = 5;
        Copro localCopro = deployCopro(flatCount);
        uint256 price = 1 ether;
        vm.prank(promoter);
        localCopro.sell(0, price);
        vm.prank(admin);
        manager.grantRole(CLIENT_ROLE, buyer, 0);
        vm.deal(buyer, 10 ether);
        vm.prank(buyer);
        vm.expectRevert(Copro.InvalidAmount.selector);
        localCopro.buy{value: 0.5 ether}(0);
    }

    function testDisabledFunctions() public {
        uint96 flatCount = 5;
        Copro localCopro = deployCopro(flatCount);
        vm.prank(promoter);
        vm.expectRevert("disabled");
        localCopro.safeTransferFrom(promoter, buyer, 0, "");
        vm.prank(promoter);
        vm.expectRevert("disabled");
        localCopro.transferFrom(promoter, buyer, 0);
        vm.prank(promoter);
        vm.expectRevert("disabled");
        localCopro.approve(buyer, 0);
        vm.prank(promoter);
        vm.expectRevert("disabled");
        localCopro.setApprovalForAll(buyer, true);
    }
}
