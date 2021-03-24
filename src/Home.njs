import Nullstack from 'nullstack';
import MetaMaskOnboarding from '@metamask/onboarding'

let web3;

class Home extends Nullstack {

  installed = false;

  async hydrate({ settings }) {
    const { ethereum } = window;
    this.installed = ethereum && ethereum.isMetaMask;
    web3 = new Web3(settings.alchemyEndpoint);
    if(localStorage['account']) {
      this.installed = true;
      this.account = localStorage['account'];
      await this.loadBalance()
    }
  }

  async installExtension() {
    console.log('installing extension...');
    const forwarderOrigin = 'http://localhost:5000';
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    onboarding.startOnboarding();
  }

  async connectWallet() {
    console.log('connecting wallet...');
    await ethereum.request({ method: 'eth_requestAccounts' });
    const [account] = await ethereum.request({ method: 'eth_accounts' });
    this.account = account;
    localStorage['account'] = account;
    await this.loadBalance();
  }

  async loadBalance() {
    const balance = await web3.eth.getBalance(this.account)
    this.balance = web3.utils.fromWei(balance, "ether") + " ETH"
  }

  async makeTransaction({ settings }) {
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
      gas: '0x2710', // customizable by user during MetaMask confirmation.
      to: settings.receiverWalletAddress, // Required except during contract publications.
      from: ethereum.selectedAddress, // must match user's active address.
      value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
      chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    this.hash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  }

  render() {
    return (
      <section>
        <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
        {!this.installed && !this.balance &&
          <button onclick={this.installExtension}> 
            Click here to install MetaMask 
          </button>
        }
        {this.installed && !this.balance &&
          <button onclick={this.connectWallet}> 
            Connect Wallet 
          </button>
        }
        {this.balance && 
          <div>
            <button onclick={this.makeTransaction}> Make transaction </button>
            <p> Balance: {this.balance}</p>
            <button onclick={this.loadBalance}> Reload Balance </button>
            {!!this.hash && 
              <p> last transaction hash: {this.hash}</p>
            }
          </div>
        }
      </section>
    )
  }

}

export default Home;