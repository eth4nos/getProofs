const rlp = require('rlp');
const Web3 = require("web3");

const provider = "http://localhost:8877";
// const provider = "https://ropsten.infura.io";
const web3 = new Web3(provider);

// values
const cpInterval = 5;

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
    var isBlooms = [];
    res.forEach((proof) => {
        // console.log(proof);
	if (!proof.isBloom) {
        	accountProofs.push(proof.accountProof);
	}
        isBlooms.push(proof.isBloom ? 1 : 0);
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
        accountProofs,
        isBlooms
    ];
    console.log("> preRlp   : ", preRlp);

    var rlped = rlp.encode(preRlp);
    console.log("> rlped    : ", rlped);

    web3.eth.getAccounts().then(accounts => {
        var address = accounts[0];
        var password = "1234"
        web3.eth.personal.unlockAccount(address, password, 0).then(()=>{
            web3.eth.sendTransaction({
                from: address,
                to: "0x0123456789012345678901234567890123456789",
                gas: 21000000,
                data: "0x" + toHexString(rlped),
            }, function (err, hash) {
                console.log("> txHash   : ", hash);
            });
        });
    });
});

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

