//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//Console functions to help debug the smart contract just like in Javascript
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    // 市场上出售的商品数量
    Counters.Counter private _iteamSold;

    address payable owner;

    // 上架手续费
    uint256 listPrice = 0.01 ether;

    // 存储上架token信息的数据结构
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    // 上架成功返回的日志信息
    event TokenListedSuccess(
        uint256 indexed tokenId,
        address payable owner,
        address payable seller,
        uint256 price,
        bool currentlyListed
    );

    // 通过id对应token上架信息
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    /**
     * @notice 创建NFT，并将NFT上架
     * @param tokenURI NFT元数据对应的IPFS URI
     * @param price NFT的价格,单位:wei
     */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        _tokenId.increment();

        uint256 newTokenId = _tokenId.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createListToken(newTokenId, price);
        return newTokenId;
    }

    /**
     * @notice NFT上架
     * @param tokenId tokenId
     * @param price 价格
     */
    function createListToken(uint256 tokenId, uint256 price) private {
        require(msg.value == listPrice, "Hopefully sending the correct price");
        require(price > 0, "Make sure the price isn't zerro");

        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);

        emit TokenListedSuccess(tokenId, payable(address(this)), payable(msg.sender), price, true);
    }

    /**
     * @notice 获取上架的所有NFT信息
     */
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 count = _tokenId.current();
        ListedToken[] memory tokens = new ListedToken[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < count; i++) {
            uint256 currentId = i + 1;
            ListedToken storage currentIteam = idToListedToken[currentId];
            tokens[currentIndex] = currentIteam;
            currentIndex++;
        }

        return tokens;
    }

    /**
     * @notice 获取自己上架的NFT列表
     */
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalCount = _tokenId.current();
        uint256 iteamCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                iteamCount++;
            }
        }

        ListedToken[] memory listedTokens = new ListedToken[](iteamCount);

        for (uint256 i = 0; i < totalCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                uint256 currentId = i + 1;
                ListedToken storage currentIteam = idToListedToken[currentId];
                listedTokens[currentIndex] = currentIteam;
                currentIndex++;
            }
        }

        return listedTokens;
    }

    /**
     * @notice 执行购买NFT交易
     * @param tokenId tokenId
     */
    function executeSale(uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;

        address seller = idToListedToken[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _iteamSold.increment();

        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);

        // 将手续费和NFT费用分别转给owner和seller
        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }

    function updateListPrice(uint256 newListPrice)public payable {
        require(msg.sender == owner, "Only owner can update listing price");
        listPrice = newListPrice;
    }

    function getListPrice() public view returns(uint256){
        return listPrice;
    }

    function getLatesIdToListedToken() public view returns(ListedToken memory) {
        uint256 currentCount = _tokenId.current();
        return idToListedToken[currentCount];
    }

    function getListedTokenForId(uint256 tokenId) public view returns(ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns(uint256) {
        return _tokenId.current();
    }
}
