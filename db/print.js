const {insertOne, findOne, findLastOne, findMany, count}  = require('./mongoAPIs');

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

        let transactions = await findMany('transactions_test', { blockNum: 7000001 });
	    console.log(transactions);        

	    // let accounts = await findMany('accounts');
        // console.log(accounts);

        // let activeAccounts = await findMany('activeAccounts');
        // console.log(activeAccounts);

        // let lastActiveAccounts = await findLastOne('activeAccounts', {number: -1});
        // console.log(lastActiveAccounts);

        // let activeAccounts = await findOne('activeAccounts', {number: 1034});
        // console.log(activeAccounts);

        // let activeAccountCount = await count('accounts');
        // console.log(activeAccountCount)

        // for (let i = 0; i < 20; i++) {
        //     console.log(await findOne('blocks', {number: i}));
        // }

        // let lastAccounts = await findLastOne('accounts', {distance: -1});
        // console.log(lastAccounts);

    } catch (err) {
        return console.error(err);
    }
})();
