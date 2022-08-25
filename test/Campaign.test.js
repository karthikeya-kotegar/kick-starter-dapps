const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactoryContract = require("../ethereum/build/CampaignFactory.json");
const compiledCampaignContract = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  //get all test accounts
  accounts = await web3.eth.getAccounts();

  //create factory contract instance and deploy it.
  factory = await new web3.eth.Contract(
    JSON.parse(compiledFactoryContract.interface)
  )
    .deploy({ data: compiledFactoryContract.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  //execute createCampaign(uint256 minimumContribution) method from factory contract.
  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: 1000000,
  });

  // execute getDeployedCampaigns() method to get list of deployed Campaigns contract address.
  const addresses = await factory.methods.getDeployedCampaigns().call();
  // assign single deployed contract address
  campaignAddress = addresses[0];

  //create Campaign contract instance from deployed contract address
  // since contract is already deployed, we don't need to deploy and send gas.
  // just pass the interface and deployed contract address
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaignContract.interface),
    campaignAddress
  );
});

describe("Campaign", () => {
  it("deploys factory and campaign contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });

    // approvers is a public mapping var, which by default will have getter method with address as argument.
    const isApprover = await campaign.methods.approvers(accounts[1]);
    assert(isApprover);
  });

  it("requires a minimum contributions", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "0",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Want money", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: 1000000,
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Want money", request.description);
  });

  it("processes the requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest(
        "Want more money",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: 1000000,
      });

    //voting
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: 1000000,
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 1000000,
    });

    //get balance by default in Wei
    let balance = await web3.eth.getBalance(accounts[1]);
    //convert to ether
    balance = web3.utils.fromWei(balance, "ether");
    // change to float number
    balance = parseFloat(balance);
    console.log(balance);
    // normally, test account will have initial balance of aprox~99.99...
    // after finalizeRequest() recipient  will get ~5 ether
    // 99 + 5 = 104
    assert(balance > 104);
  });
});
