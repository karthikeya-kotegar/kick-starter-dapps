import Web3 from "web3"; // Web3 constructor from web3 pkg

let web3;

// if window object is defined i.e browser
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  // requesting access to Metamask ethereum accounts
  window.ethereum.request({ method: "eth_requestAccounts" });
  //web3 instance
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c" //rinkeby ethereum network node
  );
  web3 = new Web3(provider);
}

// export to other files
export default web3;
