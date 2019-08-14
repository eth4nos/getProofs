const { insertOne, findOne, findLastOne, findMany, count } = require('./mongoAPIs');

const Web3 = require("web3");

const provider = "http://localhost:8081";
// const provider = "https://ropsten.infura.io";
const web3 = new Web3(provider);

let startBlockNumber = Number(process.argv[2]);
let endBlockNumber = Number(process.argv[3]);

const { exec } = require("child_process");
const SIZE_CHECK_EPOCH = 5 // Size check epoch
const sizeFileName = "storage_" + startBlockNumber + "_" + endBlockNumber
var fs = require('fs');
try {
    if (fs.existsSync(sizeFileName)) {
      // file exists
      fs.unlinkSync(sizeFileName); // remove this file to reset
    }
  } catch(err) {
    console.error(err)
}

const PATH = "/data/db_full/geth/chaindata"; // DB directory


const promisify = (inner) => {
    return new Promise(async (resolve, reject) => {
        let res = await inner().catch((e) => { console.error(e.message); reject(); });;
        resolve(res);
    })
}

// send transaction to ethereum
function sendTx(from, to, value, gas, delegatedFrom) {
    return new Promise(async (resolve, reject) => {
        await web3.eth.sendTransaction({
            from: from,
            to: to,
            value: value,
            gas: gas,
            data: delegatedFrom
        })
        .on('transactionHash', function(hash){
            //console.log('hash', hash);
            resolve(hash);
        })
        .on('receipt', function(receipt){
            //console.log('receipt', receipt);
        })
        .on('confirmation', function(confirmationNumber, receipt){ 
            //console.log('confirmation', confirmationNumber, receipt);
        })
        .on('error', () => {
            reject();
        });
    });
}

(async () => {
    let accounts = await promisify(() => web3.eth.getAccounts());
    let password = "1234"
    let from = accounts[0];

    await promisify(() => web3.eth.personal.unlockAccount(from, password, 0));

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {

        // get etheruem's current block number
        let blockNumber = await promisify(() => web3.eth.getBlockNumber());

        if (blockNumber + startBlockNumber == i) {

            // Check storage size at every epoch
            if (blockNumber % SIZE_CHECK_EPOCH == 0) {
                //exec('printf \"' + blockNumber + '	\" >> storageSize')
                //exec('du -sc ' + PATH + ' | cut -f1 | head -n 1 >> storageSize')

                exec('printf \"' + blockNumber + '	\" >>' + sizeFileName)
                exec('du -sc ' + PATH + ' | cut -f1 | head -n 1 >>' + sizeFileName)
            }

            // get transactions to send from mongodb
            let transactions = await findMany('transactions_test', { blockNum: i });
            let txNumber = (transactions != undefined ? transactions.length : 0);
            
            console.log("\nethereum block number:", blockNumber, "/ actual block number:", i - 1);
            console.log("start sending", txNumber, "transactions for block", blockNumber)

            for (let j = 0; j < txNumber; j++) {

                let to = (transactions[j]).to;
                let delegatedFrom = (transactions[j]).from;

                let hash = await sendTx(from, to, 1, 2100000, delegatedFrom);
                console.log("> txHash", j, ":", hash);
            }
        }
        else {
            // just wait for mining
            i--;
        }
    }

    console.log("finish! can terminate program")

})();
