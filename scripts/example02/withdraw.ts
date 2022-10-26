import { AlchemyProvider, Provider } from "@ethersproject/providers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BuyMeACoffee__factory } from "../../types";

async function getBalance(provider: Provider, address: string) {
    const balance = await provider.getBalance(address);
    return balance ? ethers.utils.formatEther(balance) : 0;
}

async function main() {
    const { get } = deployments;
    const buyCoffee_deployed = await get("BuyMeACoffee");
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);
    const buyCoffee = BuyMeACoffee__factory.connect(buyCoffee_deployed.address, signer);

    // Check starting balances.
    console.log(
        "current balance of owner: ",
        await getBalance(signer.provider!, signer.address),
        "ETH"
    );
    const contractBalance = await getBalance(signer.provider!, buyCoffee.address);
    console.log(
        "current balance of contract: ",
        await getBalance(signer.provider!, buyCoffee.address),
        "ETH"
    );

    if (contractBalance !== "0.0") {
        console.log("withdrawing funds..");
        const withdrawTxn = await buyCoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log("no funds to withdraw!");
    }

    console.log(
        "current balance of owner: ",
        await getBalance(signer.provider!, signer.address),
        "ETH"
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
