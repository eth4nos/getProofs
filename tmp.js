const Web3 = require("web3");

const provider = "https://ropsten.infura.io";
const web3 = new Web3(provider);

// main
var address = process.argv[2];                  // "0x7224769b9eE714dAA816053732D6Ed0AA35714CB";
var storageKey = [];                            // Empty for EOA
var blockNumber = Number(process.argv[3]);      // 6011146;

// Get Proofs
var proofs = web3.eth.getProof(address, storageKey, blockNumber).then((res) => {
    console.log(res);
});
