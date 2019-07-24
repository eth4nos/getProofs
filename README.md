# How to Use

```bash
node [js_filename] [tx_hash] [start_block_number] [end_block_number]
```

## Examples

```bash
node getProofs.js 0x7224769b9eE714dAA816053732D6Ed0AA35714CB 6036710 6036722
```

```bash
node sendProof.js 0x1111111111111111111111111111111111111234 2 13
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
type BloomResult struct {
	Address    common.Address `json:"address"`
	StateBloom Bloom          `json:"stateBloom"`
}

// GetProof returns the Merkle-proof for a given account and optionally some storage keys.
func (s *PublicBlockChainAPI) GetProof(ctx context.Context, address common.Address, storageKeys []string, blockNr rpc.BlockNumber) (interface{}, error) {
	// Bloom Filter
	block, err := s.b.BlockByNumber(ctx, blockNr)
	if block != nil {
		bloom := block.Active(address)
		if !bloom {
			return &BloomResult{
				Address:    address,
				StateBloom: block.Header().StateBloom,
			}, nil
		}
	}
	
  	// ...
  
	// create the accountProof
	accountProof, _ := state.GetProof(address)
	// if proofErr != nil {
	// 	return nil, proofErr
	// }

  	// ...
  
}
```
