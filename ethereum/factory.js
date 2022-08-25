import web3 from "./web3"; // web3 instance from web3.js file
import CampaignFactory from "./build/CampaignFactory.json";

// instance of CampaignFactory contract
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x3E14D240Aa9898abD0a7BBE0a0e5b2Bf18aaEf66" //At address of contract deployed
);

export default instance;
