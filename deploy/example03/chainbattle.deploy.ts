import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy, get } = deployments;
	const { deployer } = await getNamedAccounts();

	const chainBattles = await deploy('ChainBattles', {
		from: deployer,
		log: true,
	});
	console.log("Chain Battles 的链上地址是：",chainBattles.address);

	// 在etherscan上验证合约
	// 需先在hardhat.config.ts中配置hardhat-etherscan
	await hre.run("verify:verify",{
		address:chainBattles.address,
	})
};

export default func;
func.tags = ["chainbattle"];