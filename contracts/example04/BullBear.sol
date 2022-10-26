// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract BullBear is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    AutomationCompatibleInterface
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    // 定义chainlink喂价合约
    AggregatorV3Interface public priceFeed;

    // 跟新的时间间隔
    uint256 public interval;
    // 记录上一次的时间间隔
    uint256 public lastTimeStamp;
    // 当前ETH/USD的价格
    int256 public currentPrice;

    string[] bull_json = [
        "https://ipfs.io/ipfs/Qmc3ueexsATjqwpSVJNxmdf2hStWuhSByHtHK5fyJ3R2xb?filename=simple_bull.json",
        "https://ipfs.io/ipfs/QmRsTqwTXXkV8rFAT4XsNPDkdZs5WxUx9E5KwFaVfYWjMv?filename=party_bull.json",
        "https://ipfs.io/ipfs/QmS1v9jRYvgikKQD6RrssSKiBTBH3szDK6wzRWF4QBvunR?filename=gamer_bull.json"
    ];

    string[] bear_json = [
        "https://ipfs.io/ipfs/QmZVfjuDiUfvxPM7qAvq8Umk3eHyVh7YTbFon973srwFMD?filename=simple_bear.json",
        "https://ipfs.io/ipfs/QmQMqVUHjCAxeFNE9eUxf89H1b7LpdzhvQZ8TXnj4FPuX1?filename=beanie_bear.json",
        "https://ipfs.io/ipfs/QmP2v34MVdoxLSFj1LbGW261fvLcoAsnJWHaBK238hWnHJ?filename=coolio_bear.json"
    ];

    event TokensUpdate(string);

    constructor(uint256 _interval, address _priceFeed) ERC721("Bull&Bear", "(^-_-^)&(``O``)") {
        interval = _interval;
        lastTimeStamp = block.timestamp;

        priceFeed = AggregatorV3Interface(_priceFeed);

        currentPrice = getLatestPrice();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        // 指定默认创建NFT uri
        _setTokenURI(tokenId, bull_json[0]);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            int256 latestPrice = getLatestPrice();
            if (latestPrice == currentPrice) {
                return;
            } else if (latestPrice > currentPrice) {
                updateAllTokenUris(true);
            } else {
                updateAllTokenUris(false);
            }
            currentPrice = latestPrice;
        }
    }

    /**
     * @param bullOrBear true:Bull，false:bear
     */
    function updateAllTokenUris(bool bullOrBear) internal {
        // 获取当前tokenId，及发行NFT数量
        uint256 currentTokenId = _tokenIdCounter.current();
        string memory uri_json;
        if (bullOrBear) {
            uri_json = bull_json[1];
            emit TokensUpdate("bull");
        } else {
            uri_json = bear_json[1];
            emit TokensUpdate("bear");
        }
        for (uint256 i = 0; i < currentTokenId; i++) {
            _setTokenURI(i, uri_json);
        }
    }

    function setPriceFees(address newPriceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(newPriceFeed);
    }

    function setInterval(uint256 newInterval) external onlyOwner {
        interval = newInterval;
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
