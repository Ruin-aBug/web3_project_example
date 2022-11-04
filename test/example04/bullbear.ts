import {
    BullBear,
    BullBear__factory,
    MockV3Aggregator,
    MockV3Aggregator__factory,
} from "../../types";
import { deployments, ethers, getNamedAccounts } from "hardhat";

async function getContract() {
    const { get } = deployments;
    const { deployer } = await getNamedAccounts();
    // const priceFeedDeployed = await get("MockV3Aggregator");
    // const bullBearDePloyed = await get("BullBear");
    const signer = await ethers.getSigner(deployer);
    const priceContract = MockV3Aggregator__factory.connect(
        "0x51dcEBA0A5a13dB9448d5D7AAd64C0CD6990D7B9",
        signer
    );
    const bullBearContract = BullBear__factory.connect(
        "0xd4Fe2485F47715C19A1E2c3b6e73E6eB62E750DC",
        signer
    );
    return { priceContract, bullBearContract, deployer };
}

async function mintNFT(bullBearContract: BullBear, to: string) {
    console.log("正在mint NFT......");
    const tx = await bullBearContract.safeMint(to);
    await tx.wait();
}

async function updatePrice(priceContract: MockV3Aggregator, newPrice: string) {
    console.log("正在更新ETH/USD价格......");
    const tx = await priceContract.updateAnswer(newPrice);
    tx.wait();
    const latestPrice = await priceContract.latestAnswer();
    console.log("价格更新完成，最新价格为：", latestPrice.toNumber());
}

async function getCurrentPrice(bullBearContract: BullBear) {
    const currentPrice = await bullBearContract.currentPrice();
    console.log("current price 是：", currentPrice.toNumber());
    return currentPrice.toNumber();
}

async function checkAndUpKeep(bullBearContract: BullBear) {
    const upkeepNeeded = await bullBearContract.checkUpkeep([]);
    if (upkeepNeeded) {
        console.log("检查时间间隔通过,开始修改NFT Uri......");
        const tx = await bullBearContract.performUpkeep([]);
        tx.wait();
        console.log("NFT Uri修改结束");
    } else {
        console.log("未达到间隔时间,请继续等待");
    }
}

async function getTokenUri(bullBearContract: BullBear) {
    const tokenUri = await bullBearContract.tokenURI(0);
    console.log("当前Token Uri为:", tokenUri);
}

async function main() {
    const { priceContract, bullBearContract, deployer } = await getContract();
    await mintNFT(bullBearContract, deployer);
    await getCurrentPrice(bullBearContract);
    await getTokenUri(bullBearContract);

    await updatePrice(priceContract, "166995000000");

    await checkAndUpKeep(bullBearContract);

    await getTokenUri(bullBearContract);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
