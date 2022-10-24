import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const buyCoffee = await deploy('BuyMeACoffee', {
		from: deployer,
		log: true,
	});
	console.log("Buy Me A Coffee 链上地址是：",buyCoffee.address);

	// 在etherscan上验证合约
	// 需先在hardhat.config.ts中配置hardhat-etherscan
	await hre.run("verify:verify",{
		address:buyCoffee.address,
	})
};

export default func;
func.tags = ["buycoffee"];