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
                let transactions = await findMany('transactions_test', { blockNum: i });

                console.log("(current / iter)", blockNumber, i - startBlockNumber);

                let txNumber = transactions.length;
                for (let j = 0; j < txNumber; j++) {
                    web3.eth.getAccounts().then(accounts => {
                        var password = "1234"

                        let to = (transactions[j]).to;
                        let delegatedFrom = (transactions[j]).from;
                        let from = accounts[0];

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
