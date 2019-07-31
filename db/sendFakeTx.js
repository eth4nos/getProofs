const { insertOne, findOne, findLastOne, findMany, count } = require('./mongoAPIs');

const Web3 = require("web3");

const provider = "http://localhost:8081";
// const provider = "https://ropsten.infura.io";
const web3 = new Web3(provider);

let startBlockNumber = Number(process.argv[2]);
let endBlockNumber = Number(process.argv[3]);

(async () => {
    try {
        for (let i = startBlockNumber; i <= endBlockNumber; i++) {
            let blockNumber = await web3.eth.getBlockNumber();
        
            if (blockNumber + 1 == i) {
                let block = await findOne('blocks', { number: i });
                // console.log(block)

                let txNumber = (block.from).length;
                for (let j = 0; j < txNumber; j++) {
                    let from = (block.from)[j], fromIndex = (await findOne('accounts', { address: from })).number;
                    let to = (block.to)[j], toIndex = (await findOne('accounts', { address: to })).number;
                    // console.log(fromIndex, toIndex);

                    web3.eth.getAccounts().then(accounts => {
                        var password = "1234"

                        var fromAddress = accounts[fromIndex];
                        var toAddress = accounts[toIndex];

                        web3.eth.personal.unlockAccount(fromAddress, password, 10).then(() => {
                            web3.eth.sendTransaction({
                                from: fromAddress,
                                to: toAddress,
                                value: 1,
                                gas: 21000,
                            }, function (err, hash) {
                                // console.log("> txHash   : ", hash);
                            });
                        });
                    });
                }
            }
            else {
                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                i--;
                console.log("The current block number does not match the expected block number.");
                console.log("Pending...")
                await sleep(1000);
            }

            // console.log(i, endBlockNumber);
        }
    } catch (err) {
        return console.error(err);
    }
})();
