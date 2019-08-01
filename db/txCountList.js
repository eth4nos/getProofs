const {insertOne, findOne, findLastOne, findMany, count}  = require('./mongoAPIs');
const fs = require('fs');

(async () => {
    try {
        // let blocks = await findMany('blocks');
        // console.log(blocks);

        // let states = await findMany('states');
        // console.log(states);

        // let transactions = await findMany('transactions');
        // console.log(transactions);

        // let lastBlock = await findLastOne('blocks', {number: -1});
        // console.log(lastBlock);

        // let block = await findOne('blocks', {number: 1000000});
        // console.log(block);

        // let accounts = await findMany('accounts');
        // console.log(accounts.length);

        // let activeAccounts = await findMany('activeAccounts');
        // console.log(activeAccounts);

        // let lastActiveAccounts = await findLastOne('activeAccounts', {number: -1});
        // console.log(lastActiveAccounts);

        // let activeAccounts = await findOne('activeAccounts', {number: 1034});
        // console.log(activeAccounts);

        // let activeAccountCount = await count('accounts');
        // console.log(activeAccountCount)

        let startBlockNumber = Number(process.argv[2]);
        let endBlockNumber = Number(process.argv[3]);

        var blocks = [];
        for (let i = startBlockNumber; i <= endBlockNumber; i++) {
            // console.log(await findOne('blocks', {number: i}));
            blocks.push(await findOne('blocks', {number: i}));
        }
        const res = blocks.map((obj) => {
            return obj.to.length;            
        });
        // console.log(res);

        var jres = {
            txCount: res
        };

        fs.writeFile('txCount.json', JSON.stringify(jres), 'utf8', function(err) {
            if (err) throw err;
            console.log('complete');
        });

        // let lastAccounts = await findLastOne('accounts', {distance: -1});
        // console.log(lastAccounts);

    } catch (err) {
        return console.error(err);
    }
})();
