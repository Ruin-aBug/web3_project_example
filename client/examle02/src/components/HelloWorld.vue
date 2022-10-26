<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <button @click="connectWallet()" v-if="!account.isConnect">connect you wallet</button>
        <p name="account" v-if="account.isConnect">address:{{ account.address }}</p>
        <br /><br />
        <span>name:</span><input type="txt" v-model="inputData.name" />
        <p>send ruin a message</p>
        <input type="txt" v-model="inputData.message" /><br /><br />
        <button name="buyCoffee" @click="buyMeACoffee()">send 1 coffee for 0.001 ETH</button>
        <h2>Memos received</h2>
        <div class="box" v-for="memo in memos" :key="memo.timestamp">
            <p>"{{ memo.message }}"</p>
            <p>from:{{ memo.name }} at {{ memo.timestamp }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ethers } from "ethers";
import { BuyMeACoffee__factory } from "../types";

declare global {
    interface Window {
        ethereum: ethers.providers.ExternalProvider;
    }
}

const buyMeACoffeeAddress = "0x4f5508e17e9078fBB6A6Dc025eFc8aE8B4d53f0F";

export default defineComponent({
    name: "HelloWorld",
    props: {
        msg: String,
    },
    data() {
        return {
            account: { address: "", isConnect: false },
            inputData: {
                name: "haha",
                message: "hhhhhhhhhhhhh",
            },
            ethValue: "0.001",
            memos: [
                {
                    from: "",
                    timestamp: "",
                    name: "",
                    message: "",
                },
            ],
        };
    },
    methods: {
        setAccount(accounts: string[]) {
            if (accounts.length > 0) {
                this.account.address = accounts[0];
                this.account.isConnect = true;
            } else {
                this.account.isConnect = false;
            }
        },
        async requestAccount() {
            const { ethereum } = window;
            const accounts = await ethereum.request!({ method: "eth_accounts" });
            const network = await ethereum.request!({ method: "eth_chainId" });
            if (network != 5) {
                alert("network error, Please switch to Goerli network");
            } else {
                this.setAccount(accounts);
            }
        },
        async isWalletConnect() {
            try {
                await this.requestAccount();
                if (!this.account.isConnect) {
                    console.log("make sure MetaMask is connected");
                }
            } catch (error) {
                console.log("error::", error);
            }
        },
        async connectWallet() {
            if (typeof window.ethereum !== undefined) {
                const accounts = await window.ethereum.request!({
                    method: "eth_requestAccounts",
                });
                this.setAccount(accounts);
            } else {
                console.log("请安装MetaMask钱包!");
            }
        },
        async getContract() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = BuyMeACoffee__factory.connect(buyMeACoffeeAddress, signer);
            return contract;
        },
        async buyMeACoffee() {
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const buyMeACoffee = await this.getContract();
                    const coffeeTx = await buyMeACoffee.buyCoffee(
                        this.inputData.name,
                        this.inputData.message,
                        { value: ethers.utils.parseEther(this.ethValue) }
                    );
                    await coffeeTx.wait();
                    this.inputData = { name: "", message: "" };
                    await this.getMemos();
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getMemos() {
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const buyMeACoffee = await this.getContract();
                    const memosData = await buyMeACoffee.getMemos();
                    this.memos = [];
                    if (memosData.length > 0) {
                        for (var memo of memosData) {
                            this.memos.push({
                                name: memo.name,
                                from: memo.from,
                                timestamp: new Date(
                                    memo.timestamp.toNumber() * 1000
                                ).toDateString(),
                                message: memo.message,
                            });
                        }
                    }
                    console.log(this.memos);
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
    async mounted() {
        await this.isWalletConnect();
        await this.getMemos();
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
div.box {
    border-style: solid;
    border-width: 1px;
    width: 200px;
    height: 100px;
    margin: 0 auto;
}
</style>
