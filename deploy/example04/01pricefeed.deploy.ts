import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { MockV3Aggregator__factory } from "../../types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, getChainId } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const priceFeed = await deploy("MockV3Aggregator", {
        from: deployer,
        log: true,
        args: [8, 156995000000],
    });
    console.log("Price Feed 的链上地址是：", priceFeed.address);
    const chainId = await getChainId();
    console.log(chainId);
    if (chainId !== "31337") {
        // 在etherscan上验证合约
        // 需先在hardhat.config.ts中配置hardhat-etherscan
        await hre.run("verify:verify", {
            address: priceFeed.address,
        });
    }
};

export default func;
func.tags = ["pricefeed"];
