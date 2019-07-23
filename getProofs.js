const rlp = require('rlp');
const Web3 = require("web3");

const provider = "http://localhost:8081";
// const provider = "https://ropsten.infura.io";
const web3 = new Web3(provider);

// values
const cpInterval = 10;

// functions
function getProofs(address, storageKey, startBlockNumber, endBlockNumber) {
    var proofs = [];
    for (var i = startBlockNumber; i <= endBlockNumber; i += cpInterval) {
        var proof = web3.eth.getProof(address, storageKey, i).catch((err) => {
            // console.log(err)
        });
        proofs.push(proof);
    }
    return proofs;
}

// main
var address = process.argv[2];          // "0x7224769b9eE714dAA816053732D6Ed0AA35714CB";
var storageKey = [];                    // Empty for EOA
var from = Number(process.argv[3]);     // 6011146;
var to = Number(process.argv[4]);       // 6011172;

// Get Proofs
var proofs = getProofs(address, storageKey, from, to);
Promise.all(proofs).then((res) => {
    var accountProofs = [];
    res.forEach((proof) => {
        // console.log(proof);       
        accountProofs.push(proof.accountProof);
    });

    /*
    var preRlp = {
        "address" : address,
        "startBlockNumber" : from,
        "accountProofs" : accountProofs
    };
    */
    var preRlp = [
        address,
        from,
        accountProofs
    ];
    // console.log(preRlp);

    var rlped = rlp.encode(preRlp);
    console.log(rlped);

    web3.eth.getAccounts().then(accounts => {
        // console.log(accounts);
        unlockAccount(accounts[0], "12341234");

        web3.eth.sendTransaction({
            from: accounts[0],
            to: "0x0123456789012345678901234567890123456789",
            gas: 21000000,
            data: "0x" + toHexString(rlped),
        }, function (err, hash) {
            console.log(hash);
        });
    });

});

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function unlockAccount(address, password) {
    // console.log("> Unlocking coinbase account");
    try {
        web3.eth.personal.unlockAccount(address, password, 0)
    } catch (e) {
        console.log(e);
        return;
    }
}
