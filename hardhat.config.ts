import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage"
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

// set proxy
// 在国内需要通过hardhat-etherscan在etherscan上验证合约时，需要设置代理
const proxyUrl = 'http://172.31.240.1:7890';   // change to yours, With the global proxy enabled, change the proxyUrl to your own proxy link. The port may be different for each client.
import { ProxyAgent, setGlobalDispatcher } from "undici";
const proxyAgent = new ProxyAgent(proxyUrl);
setGlobalDispatcher(proxyAgent);

const goerli_url = process.env.GOERLI_RPC_URL || "";
const bsc_test_url = process.env.BSC_TEST_RPC_URL || "";
const accounts = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
const etherscan_key = process.env.ETHERSCAN_API_KEY || "";
const bscscan_key = process.env.BSCSCAN_API_KEY || "";
const coinmarket_api_key = process.env.COINMARKETCAP_API_KEY || "";

// 使用方法yarn hardhat block-number --network networkName
task("block-number", "prints the current block number").setAction(
	async (taskArgs, hre) => {
		const blockNumber = await hre.ethers.provider.getBlockNumber();
		console.log(`current block number:${blockNumber}`);
	}
)

const config: HardhatUserConfig = {
	namedAccounts: {
		deployer: 0
	},
	typechain: {
		outDir: "types",
		target: "ethers-v5"
	},
	paths: {
		sources: "contracts",
	},
	solidity: {
		compilers: [
			{
				version: "0.8.0",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			}, {
				version: "0.8.2",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			}, {
				version: "0.8.9",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			}
		]
	},
	defaultNetwork: "hardhat",
	networks: {
		goerli: {
			url: goerli_url,
			accounts: accounts,
			chainId: 5,
			live: true,
			saveDeployments: true,
		},
		bsctest: {
			url: bsc_test_url,
			accounts: accounts,
			chainId: 97,
			live: true,
			saveDeployments: true
		}
	},
	etherscan: {
		//hardhat-etherscan
		apiKey: etherscan_key,
	},
	gasReporter: {
		enabled: true,
		outputFile: "gas-reporter.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: coinmarket_api_key,
		token: "ETH"
	}
};

export default config;
