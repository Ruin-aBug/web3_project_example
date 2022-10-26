import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { DeployFunction } from "hardhat-deploy/types";
import { MockV3Aggregator__factory } from "../../types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, getChainId } = hre;
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();
    // return;
    const priceFeed = (await get("MockV3Aggregator")).address;
    const bullBear = await deploy("BullBear", {
        from: deployer,
        log: true,
        args: [10, priceFeed],
    });
    console.log("bull & bear 的链上地址是：", bullBear.address);
    const chainId = await getChainId();
    if (chainId !== "31337") {
        // 在etherscan上验证合约
        // 需先在hardhat.config.ts中配置hardhat-etherscan
        await hre.run("verify:verify", {
            address: bullBear.address,
            constructorArguments: [10, priceFeed],
        });
    }
};

export default func;
func.tags = ["bullbear"];
