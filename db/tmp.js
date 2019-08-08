const { insertOne, findOne, findLastOne, findMany, count } = require('./mongoAPIs');

const Web3 = require("web3");

const provider = "http://localhost:8081";
// const provider = "https://ropsten.infura.io";
const web3 = new Web3(provider);

const { exec } = require("child_process");
const SIZE_CHECK_EPOCH = 5 // Size check epoch
const PATH = "/data/db_full/geth/chaindata"; // DB directory

let startBlockNumber = Number(process.argv[2]);
let endBlockNumber = Number(process.argv[3]);

(async () => {
    try {
        for (let i = startBlockNumber; i <= endBlockNumber; i++) {
            let blockNumber = await web3.eth.getBlockNumber();

            // Check storage size every epoch before sweeping
            if (blockNumber % SIZE_CHECK_EPOCH == 0) {
                exec('printf \"' + blockNumber + '	\" >> storageSize')
                exec('du -sch ' + PATH + ' | cut -f1 | head -n 1 >> storageSize')
            }

            if (blockNumber + startBlockNumber == i) {
                let transactions = await findMany('transactions_test', { blockNum: i });
                console.log("(current / iter)", blockNumber, "/", i - startBlockNumber);

                let txNumber = (transactions != undefined ? transactions.length : 0);
                for (let j = 0; j < txNumber; j++) {
                    web3.eth.getAccounts().then(accounts => {
                        var password = "1234"

                        let to = (transactions[j]).to;
                        let delegatedFrom = (transactions[j]).from;
                        let from = accounts[0];

                        web3.eth.personal.unlockAccount(from, password, 10).then(() => {                          
                            web3.eth.sendTransaction({
                                from: from,
                                to: to,
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
