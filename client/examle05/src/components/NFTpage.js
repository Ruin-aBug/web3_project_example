import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { getContract } from "./contract/NFTMarketplace__factory";
import { ethers } from "ethers";

export default function NFTPage(props) {
  const [data, updateData] = useState({});
  const [message, updateMessage] = useState("");
  const [dataFetched, updateDataFetched] = useState(false);
  const [currAddress, updateCurrAddress] = useState("0x");

  async function getNFTData(tokenId) {

    let contract = await getContract();
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);
    console.log(currAddress)

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
  }

  async function buyNFT(tokenId) {
    try {
      let contract = await getContract();
      const salePrice = ethers.utils.parseEther(data.price);
      let transaction = await contract.executeSale(tokenId, { value: salePrice });
      await transaction.wait();
      alert('You successfully bought the NFT!');
    } catch (error) {
      alert("BuyNFT Error" + error);
    }
  }

  const params = useParams();
  const tokenId = params.tokenId;

  if (!dataFetched) {
    getNFTData(tokenId)
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20">
        <img src={data.image} alt="" className="w-2/5" />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Price: <span className="">{data.price + " ETH"}</span>
          </div>
          <div>
            Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {currAddress == data.owner || currAddress == data.seller ? (
              <div className="text-emerald-700">You are the owner of this NFT</div>
            ) : (
              <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={()=>buyNFT(tokenId)}>
                Buy this NFT
              </button>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
