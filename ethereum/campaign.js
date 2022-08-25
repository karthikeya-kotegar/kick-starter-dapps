import web3 from "./web3"; // web3 instance from web3.js file
import Campaign from "./build/Campaign.json";

//create instance of Campaign contract for particular contract address.
const campaign = (address) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

//export the instance of Campaign contract
export default campaign;
