import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy, get } = deployments;
	const { deployer } = await getNamedAccounts();

	const mynft = await deploy('MyNFT', {
		from: deployer,
		log: true,
	});
	console.log(mynft.address);

	// 在etherscan上验证合约
	// 需先在hardhat.config.ts中配置hardhat-etherscan
	await hre.run("verify:verify",{
		address:mynft.address,
	})
};

export default func;
func.tags = ["mynft"];