import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { DeployFunction } from 'hardhat-deploy/types';
import { run } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy, get } = deployments;
	const { deployer } = await getNamedAccounts();

	const args = ["1667142313"];

	const lock = await deploy('Lock', {
		from: deployer,
		log: true,
		args: args
	});
	console.log(lock.address);
	verify(hre, lock.address,args)
};

async function verify(hre: HardhatRuntimeEnvironment,contractAddress: string, args: string[]) {
	console.log("Verifying SimpleStorage Contract...");
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguements: args,
		})
	} catch (e) {
		// if(e.message.toLowerCase().includes("already verified!")){
		// 	console.log("Already Verified");
		// }else{
			console.log(e);
		// }
	}
}
export default func;
func.tags = ["lock"];