// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/token/ERC20/ERC20.sol";
import "@openzeppelin/access/Ownable.sol";
import "@openzeppelin/token/ERC721/IERC721Receiver.sol";

contract FractionalToken is ERC20, Ownable, IERC721Receiver {

    // =============================================================
    //                          ERRORS
    // =============================================================

    error NoSaleActive();
    error InsufficientFunds();
    error NoTokenToList();

    // =============================================================
    //                          EVENTS
    // =============================================================

    event ReceivedNFT(address operator, address from, uint256 tokenId, bytes data);
    event TokensListed(address indexed seller, uint256 amount, uint256 pricePerToken);
    event TokensPurchasedFromSeller(address indexed seller, address indexed buyer, uint256 amount, uint256 totalPrice);
    event SaleOrderCanceled(address indexed seller, uint256 amount);

    // =============================================================
    //                          MAPPINGS
    // =============================================================

    mapping(address => SaleOrder) public saleOrders;
    mapping(address => uint256) public supply;

    // =============================================================
    //                          STRUCTS
    // =============================================================

    struct SaleOrder {
        uint256 amount;         // Number of tokens for sale
        uint256 pricePerToken;  // price in wei
    }

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    /**
     * @notice ERC20 contract which represents the property of an NFT.
     * @param name name of token
     * @param symbol symbol of token
     * @param coOwners co-owners of NFT.
     * @param totalSupply total supply of tokens
     */
    constructor(
        string memory name,
        string memory symbol,
        address[] memory coOwners,
        uint256 totalSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        uint256 supplyByCoOwner = totalSupply / coOwners.length;
        for(uint8 i = 0; i < coOwners.length; i ++) {
            _mint(coOwners[i], supplyByCoOwner);
            supply[coOwners[i]] = supplyByCoOwner;
        }
    }
    
    // =============================================================
    //                          FUNCTIONS
    // =============================================================

    /**
     * @notice Permits owner to mint other tokens
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
    * @notice Permits to a owner to list all his tokens for sale.
    * Listed tokens are transferred to the contract
    * The price is specified in ether and converted in wei
    * @param pricePerTokenInEther Price asked by owner
    */
    function listAllTokensForSale(uint256 pricePerTokenInEther) external {
        uint256 sellerBalance = balanceOf(msg.sender);
        if (sellerBalance == 0) revert NoTokenToList();

        _transfer(msg.sender, address(this), sellerBalance);
        uint256 pricePerTokenWei = pricePerTokenInEther * 1 ether;

        saleOrders[msg.sender] = SaleOrder({
            amount: sellerBalance,
            pricePerToken: pricePerTokenWei
        });

        emit TokensListed(msg.sender, sellerBalance, pricePerTokenWei);
    }

    /**
    * @notice Permits to a buyer to buy all the token listed by a seller.
    * @param seller seller address
    */
    function purchaseAllTokensFromSeller(address seller) external payable {
        SaleOrder storage order = saleOrders[seller];
        uint256 amount = order.amount;
        if (amount == 0) revert NoSaleActive();

        uint256 totalPrice = order.pricePerToken * amount;
        if (msg.value <= totalPrice) revert InsufficientFunds();

        _transfer(address(this), msg.sender, amount);
        delete saleOrders[seller];

        payable(seller).transfer(totalPrice);
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit TokensPurchasedFromSeller(seller, msg.sender, amount, totalPrice);
    }


    /**
    * @notice Permits to a seller to cancel his sell and get back his tokens.
    */
    function cancelSaleOrder() external {
        SaleOrder storage order = saleOrders[msg.sender];
        if (order.amount == 0) revert NoSaleActive();

        uint256 amount = order.amount;

        delete saleOrders[msg.sender];

        _transfer(address(this), msg.sender, amount);

        emit SaleOrderCanceled(msg.sender, amount);
    }

    /**
     * @notice IERC721Receiver implementation to authorize an NFT reception
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {

        emit ReceivedNFT(operator, from, tokenId, data);

        return IERC721Receiver.onERC721Received.selector;
    }
}
