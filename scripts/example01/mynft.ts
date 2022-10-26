import { deployments, ethers, getNamedAccounts } from "hardhat";
import { MyNFT, MyNFT__factory } from "../../types";

async function main() {
    const uri = "ipfs://复制的CID";
    const { get } = deployments;
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);
    const mynft_deployed = await get("MyNFT");

    let mynft: MyNFT;
    mynft = MyNFT__factory.connect(mynft_deployed.address, signer);
    const tx = await mynft.safeMint(deployer, uri);
    await tx.wait();
    console.log(
        `此次铸造的NFT交易交易哈希为:${tx.hash},\n可在'https://goerli.etherscan.io/tx/${tx.hash}'进行查看`
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
