# Web3 Project Collection

这是一个web3项目的集合，有合约的测试、部署和前端展示等示例。

## 项目使用
在项目跟目录下运行相关`hardhat`命令
合约编译：
```shell
yarn hardhat compile
```
合约测试：
```shell
yarn hardhat test
```
合约部署：
```shell
yarn hardhat deploy --network networkName --tags deployTags
```
更多知识可在[hardhat官网](https://hardhat.org/hardhat-runner/docs/getting-started)自行学习

## example01
这是一个关于ERC-721的NFT示例，主要演示了NFT的合约编写测试和部署，并将相关的图片和元数据存储在IPFS，最后通过OpenSea进行展示的Demo
项目路径[/contract/expample01](./contracts/example01/)
## example02
这是一个购买咖啡并留言的Dapp项目，用户通过点击发送0.001ETH来进行咖啡购买留言，支付的0.001ETH会存储在合约中，通过调用withdrawTips()方法提取到用户钱包。
具体可查看[/contracts/example02/](./contracts/example02/)详细介绍。