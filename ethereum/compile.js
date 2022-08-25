const path = require("path");
const solc = require("solc"); //solidity compiler
const fs = require("fs-extra"); //more features than built in fs pkg

//get the path to build folder
const buildPath = path.resolve(__dirname, "build"); //root directory and name i.e 'ethereum/build' path
// delete data in build folder
fs.removeSync(buildPath);

//get the Campaign.sol contract path from contracts folder
const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol"); //i.e ethereum/contracts/Campaign.sol
//read the contract source code
const source = fs.readFileSync(contractPath, "utf8");

//compile the contract
const output = solc.compile(source, 1).contracts;
// console.log(output); //output contains 2 contracts data i.e CampaignFactory and Campaign

//write output to build folder
fs.ensureDirSync(buildPath); //check if folder exists?

//Note:
// for-in loop iterates the key/index of object/array
// for-of loop iterates the values of objext/array.

// iterate all contracts(CampaignFactory and Campaign)
for (let contract in output) {
  //for-in loop returns keys for contract
  // store the contract data in build folder in json format.
  fs.outputJSONSync(
    // create new file on given path with given data.
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
  //Note: when compiled windows user will get "Error: ENOENT: no such file or directory, open 'C:\Users\Admin\Documents\doc\saved\block\Dapps\kickstart\ethereum\build\:Campaign.json'"
  // because of  ':' at begining of contract key name, so replace ':' with ''.
}
