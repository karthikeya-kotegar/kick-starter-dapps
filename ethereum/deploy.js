//deploy the contract
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

//we will use compiled factory contract
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "since guitar toast grief drop risk teach pole snake hope female scene",
  "https://rinkeby.infura.io/v3/fe1c24d8eaba43c3835a7f2a1c8aec39"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  //contract instance and deployment
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({
      from: accounts[0],
      gas: 1000000,
    });

  console.log("Contract deployed at: ", result.options.address);

  // to prevent hanging deployment
  provider.engine.stop();
};

//call
deploy();
