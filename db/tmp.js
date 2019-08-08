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

            if (blockNumber + startBlockNumber == i) {
                let block = await findOne('blocks', { number: i });
                // console.log(block)

                console.log("current block number", blockNumber);
                console.log("iter block number", i - startBlockNumber);

                let toNumber = (block.to).length;
                let fromNumber = (block.from).length;
                let txNumber = toNumber > fromNumber ? toNumber : fromNumber;

                for (let j = 0; j < txNumber; j++) {
                    // let from = (block.from)[j], fromIndex = (await findOne('accounts', { address: from })).number;
                    // let to = (block.to)[j], toIndex = (await findOne('accounts', { address: to })).number;
                    // console.log(fromIndex, toIndex);

                    web3.eth.getAccounts().then(accounts => {
                        var password = "1234"

                        let to = (block.to)[j];
                        if (to == undefined) {
                            // to = (block.to)[0];
                            to = accounts[0];
                        }
                        let delegatedFrom = (block.from)[j];
                        if (delegatedFrom == undefined) {
                            // from = (block.from)[j];
                            delegatedFrom = accounts[0];
                        }
                        let from = accounts[0];

                        // var fromAddress = accounts[fromIndex];
                        // var toAddress = accounts[toIndex];
                        var fromAddress = from;
                        var toAddress = to;

                        web3.eth.personal.unlockAccount(fromAddress, password, 3).then(() => {
                            web3.eth.sendTransaction({
                                from: fromAddress,
                                to: toAddress,
                                value: 1,
                                gas: 2100000,
                                data: delegatedFrom
                            }, function (err, hash) {
                                // console.log("> txHash: ", hash, "delegatedFrom: ", delegatedFrom, "to: ", toAddress, "from: ", from);
                                console.log("> txHash: ", hash);
                            });
                        });
                    });
                }
            }
            else {
                // wait for mining
                i--;
                //console.log("The current block number does not match the expected block number.");
                //console.log("Pending...")
                //console.log("iter block number", i-startBlockNumber);
            }

            // console.log(i, endBlockNumber);
        }
    } catch (err) {
        return console.error(err);
    }
})();
