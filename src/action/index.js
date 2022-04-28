import { appStore } from "@/store";
export default {
  // 读取MetaMask，更新账号等
  async scanMetaMaskAccount() {
    //以太坊web3
    if (window.ethereum.chainId !== "0x3" || window.ethereum.chainId !== "3") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x3" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1",
                  rpcUrl:
                    "https://main.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                  chainName: "Ethereum Mainnet",
                  // chainId: "0x3",
                  // rpcUrl: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                  // chainName: "Ropsten Test Network",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: "https://ropsten.etherscan.io",
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        window.location.reload();
      }
    }
    let ether;
    if (window.ethereum) {
      ether = window.ethereum;
    }

    if (ether) {
      // 检测是否安装
      // bus.appvue.$store.commit("setAppKey", {
      //     'is_metamask_installed': true,
      // });
      let address;
      // 收集账号状态
      if (window.ethereum) {
        address = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      }
      let account_json = {
        default_address: address[0] || "",
      };
      if (account_json.default_address) {
        const store = appStore();
        store.defaultAddress = account_json.default_address;
      }
    }
  },

  listenMetaMask() {
    let me = this;
    window.addEventListener("message", function (e) {
      let d = e.data;
      if (d.isMetaMask) {
        // 重新读取账号
        me.scanMetaMaskAccount();

        // UI：交易成功的提示
        if (e.data.message && e.data.message.action == "tabReply") {
          console.log("tabReply event", e.data.message);
          let tx = e.data.message.data.data.txID;
          if (tx) {
            console.log("tx");
          }

          // refresh wallet balance
          setTimeout(function () {
            // 页面存在时请求
            // if (bus.stakeinfovue) {
            //     bus.stakeinfovue.getAllData()
            // }
          }, 6000);
        }
      }

      try {
        if (d.data.data.method === "metamask_accountsChanged") {
          window.location.reload();
        }
      } catch (e) {
        console.log("metamask account not change");
      }
    });
  },

  async getAddress() {
    if (window.ethereum) {
      let addresses = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return addresses[0];
    }
  },
};
