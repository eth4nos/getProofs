# How to Use

```bash
node getProofs.js 0x7224769b9eE714dAA816053732D6Ed0AA35714CB 6036710 6036722
```

# Modifying Geth

* In `internal/ethapi/api.go`, change the below code

```go
// GetProof returns the Merkle-proof for a given account and optionally some storage keys.
func (s *PublicBlockChainAPI) GetProof(ctx context.Context, address common.Address, storageKeys []string, blockNr rpc.BlockNumber) (*AccountResult, error) {

  // ...
  
	// create the accountProof
	accountProof, proofErr := state.GetProof(address)
	if proofErr != nil {
		return nil, proofErr
	}

  // ...
  
}
```

to

```go
// GetProof returns the Merkle-proof for a given account and optionally some storage keys.
func (s *PublicBlockChainAPI) GetProof(ctx context.Context, address common.Address, storageKeys []string, blockNr rpc.BlockNumber) (*AccountResult, error) {

  // ...
  
	// create the accountProof
	accountProof, proofErr := state.GetProof(address)
	// if proofErr != nil {
	// 	return nil, proofErr
	// }

  // ...
  
}
```
