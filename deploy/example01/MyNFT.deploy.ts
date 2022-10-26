// import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { DeployFunction } from "hardhat-deploy/types";
import { deployments, getNamedAccounts, run, getChainId } from "hardhat";

const func: DeployFunction = async function () {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const mynft = await deploy("MyNFT", {
        from: deployer,
        log: true,
    });
    console.log(mynft.address);
    const chainId = await getChainId();
    if (chainId !== "31337") {
        // 在etherscan上验证合约
        // 需先在hardhat.config.ts中配置hardhat-etherscan
        await run("verify:verify", {
            address: mynft.address,
            contract: "contracts/example01/MyNFT.sol:MyNFT",
        });
    }
};

export default func;
func.tags = ["mynft", "nft", "my"];
