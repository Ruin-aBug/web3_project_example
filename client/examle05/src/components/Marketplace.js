import NFTTile from "./NFTTile";
import Navbar from "./Navbar.js";
import axios from "axios";
import { useState } from "react";
import { getContract } from "./contract/NFTMarketplace__factory";
import { ethers } from "ethers";

export default function Marketplace() {
  const sampleData = [
    {
      name: "NFT#1",
      description: "Alchemy's First NFT",
      website: "http://axieinfinity.io",
      image: "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#2",
      description: "Alchemy's Second NFT",
      website: "http://axieinfinity.io",
      image: "https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#3",
      description: "Alchemy's Third NFT",
      website: "http://axieinfinity.io",
      image: "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
  ];
  const [dataFetched, updateFetched] = useState(false);
  const [data, updateData] = useState(sampleData);

  async function getAllNFTs() {
    let contract = await getContract();

    const ethers = require("ethers")
    const provider = new ethers.providers.Web3Provider(window["ethereum"]);
    const signer = provider.getSigner();

    let transaction = await contract.getAllNFTs();

    const items = await Promise.all(transaction.map(async i => {
      const tokenURI = await contract.tokenURI(i.tokenId);
      let metadata = await axios.get(tokenURI);
      metadata = metadata.data;
      let price = ethers.utils.formatEther(i.price.toString());
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: metadata.image,
        name: metadata.name,
        description: metadata.description,
      }
      return item;
    }));
    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) {
    getAllNFTs();
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">Top NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
