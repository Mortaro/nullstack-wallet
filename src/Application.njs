import Nullstack from 'nullstack';
import './Application.scss';
import Home from './Home';

class Application extends Nullstack {

  static async start(context) {
    await this.startProject(context);
    await this.startSettings(context);
  }

  static async startProject({ project }) {
    project.name = 'NFT Thingy';
    project.domain = 'localhost';
    project.color = '#D22365';
  }

  static async startSettings({ settings }) {
    settings.alchemyEndpoint = "wss://eth-ropsten.ws.alchemyapi.io/v2/Ji2svmQPCSmogF_WigI3HDpEbtevKOlk";
    settings.receiverWalletAddress = '0x0000000000000000000000000000000000000000';
  }

  prepare({ project, page }) {
    page.title = `${project.name} - Wallet`;
    page.description = `${project.name} wallet test`;
    page.locale = 'en-US';
  }

  render() {
    return (
      <main>
        <Home route="/" />
      </main>
    )
  }

}

export default Application;