//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattles is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    //store all NFT ID
    Counters.Counter private _tokenIds;

    // Store the NFT level corresponding to the tokenId
    mapping(uint256 => uint256) public tokenIdToLevels;

    constructor() ERC721("ChainBattles", "CBTS") {}

    /**
     * @notice 创建一个新的NFT
     */
    function mint() public {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        tokenIdToLevels[newTokenId] = 0;
        // 通过tokenId获取到URI并存储在链上
        _setTokenURI(newTokenId, getTokenURI(newTokenId));
    }

    function getLevels(uint256 tokenId) public view returns (string memory) {
        uint256 levels = tokenIdToLevels[tokenId];
        return levels.toString();
    }

    /**
     * @notice 生产tokenId对应NFT的svg图像
     * @dev svg代码通过abi.encodePacked()方法编码为一个bytes类型的abi，
     * 然后在通过Base64.encode(data)方法将bytes类型的svg编码转换为base64的编码，
     * 并通过abi.encodePacked()方法在前面添加“data:image/svg+xml;base64”字符串，
     * 向浏览器指定Base64字符串是SVG图像和怎么打开它
     * @param tokenId NFT的tokenId
     */
    function generateCharacter(uint256 tokenId) public view returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Warrior",
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Levels: ",
            getLevels(tokenId),
            "</text>",
            "</svg>"
        );
        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
    }

    /**
     * @notice 通过tokenId获取NFT元数据信息
     * @dev 这里也是使用了abi.encodePacked()方法来创建json对象，
     * 通过将组装的json 字符串打包为bytes类型的abi，
     * 然后再通过abi.encodePacked()在前面加上“data:application/json;base64,”，
     * 用来代表这是一个base64编码的数据指令
     */
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Chain Battles #',
            tokenId.toString(),
            '",',
            '"description": "Battles on chain",',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    /**
     * @notice 训练NFT以提升等级
     */
    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        require(ownerOf(tokenId) == msg.sender, "You must own this token to train it");
        uint256 currentLevel = tokenIdToLevels[tokenId];
        tokenIdToLevels[tokenId] = currentLevel + 1;
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}
