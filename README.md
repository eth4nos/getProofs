# Geth

## getProof

```bash
> eth.getProof("0x518006b1e93be0dcca1f43870d11d19022735195", [], 1)
{
  accountProof: ["0xf879a120310d79399c75734700e5e8a6fcc51f5e3bfa7d01a00e42c35e578d61a3dca95bb855f853808f13426172c74d8270eb216a44f40000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"],
  address: "0x518006b1e93be0dcca1f43870d11d19022735195",
  balance: "0x13426172c74d8270eb216a44f40000",
  codeHash: "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
  nonce: "0x0",
  storageHash: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
  storageProof: []
}
```

# How to Use

```bash
node [js_filename] [tx_hash] [start_block_number] [end_block_number]
```

* **Use sendProof.js**

## Examples

```bash
node getProofs.js 0x7224769b9eE714dAA816053732D6Ed0AA35714CB 6036710 6036722
```

```bash
node sendProof.js 0x1111111111111111111111111111111111111234 2 13
```
<!--
# Modifying Geth

* In `internal/ethapi/api.go,

```go
// GetProof returns the Merkle-proof for a given account and optionally some storage keys.
func (s *PublicBlockChainAPI) GetProof(ctx context.Context, address common.Address, storageKeys []string, blockNr rpc.BlockNumber) (*AccountResult, error) {
	state, header, err := s.b.StateAndHeaderByNumber(ctx, blockNr)
	if state == nil || err != nil {
		return nil, err
	}

	storageTrie := state.StorageTrie(address)
	storageHash := types.EmptyRootHash
	codeHash := state.GetCodeHash(address)
	storageProof := make([]StorageResult, len(storageKeys))

	// if we have a storageTrie, (which means the account exists), we can update the storagehash
	if storageTrie != nil {
		storageHash = storageTrie.Hash()
	} else {
		// no storageTrie means the account does not exist, so the codeHash is the hash of an empty bytearray.
		codeHash = crypto.Keccak256Hash(nil)
	}

	// Bloom Filter
	block, err := s.b.BlockByNumber(ctx, blockNr)
	if block != nil {
		bloom := block.Active(address)
		log.Info("Bloom", "bloom", bloom)

		if !bloom {
			log.Info("Bloom: Address Inactive", "stateBloom", header.StateBloom, "address", address)

			var d []byte
			header.StateBloom.SetBytes(d)

			return &AccountResult{
				Address:      address,
				AccountProof: []string{common.ToHex(d)},
				IsBloom:      true,
				Balance:      (*hexutil.Big)(state.GetBalance(address)),
				CodeHash:     codeHash,
				Nonce:        hexutil.Uint64(state.GetNonce(address)),
				StorageHash:  storageHash,
				StorageProof: storageProof,
			}, state.Error()
		}
	}

	// create the proof for the storageKeys
	for i, key := range storageKeys {
		if storageTrie != nil {
			proof, storageError := state.GetStorageProof(address, common.HexToHash(key))
			if storageError != nil {
				return nil, storageError
			}
			storageProof[i] = StorageResult{key, (*hexutil.Big)(state.GetState(address, common.HexToHash(key)).Big()), common.ToHexArray(proof)}
		} else {
			storageProof[i] = StorageResult{key, &hexutil.Big{}, []string{}}
		}
	}

	// create the accountProof
	accountProof, _ := state.GetProof(address)
	// accountProof, proofErr := state.GetProof(address)
	// if proofErr != nil {
	// 	return nil, proofErr
	// }

	return &AccountResult{
		Address:      address,
		AccountProof: common.ToHexArray(accountProof),
		IsBloom:      false,
		Balance:      (*hexutil.Big)(state.GetBalance(address)),
		CodeHash:     codeHash,
		Nonce:        hexutil.Uint64(state.GetNonce(address)),
		StorageHash:  storageHash,
		StorageProof: storageProof,
	}, state.Error()
}
```
-->
