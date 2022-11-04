import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, getChainId } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const nftMarket = await deploy("NFTMarketplace", {
        from: deployer,
        log: true,
    });
    console.log("NFT Market Price 的链上地址是：", nftMarket.address);
    const chainId = await getChainId();
    if (chainId !== "31337") {
        // 在etherscan上验证合约
        // 需先在hardhat.config.ts中配置hardhat-etherscan
        await hre.run("verify:verify", {
            address: nftMarket.address
        });
    }
};

export default func;
func.tags = ["nftmarket"];
