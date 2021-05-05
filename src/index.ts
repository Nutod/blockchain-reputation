// 1. Generate transactions that represent the transactions in the open transactions
// 2. Run consensus

import Blockchain from './dlt/blockchain'
import PubSub from './PubSub/PubSub'
import Wallet from './wallet'
import TransactionPool from './wallet/transactionPool'
import TransactionMiner from './wallet/transactionMiner'
import { ITransaction } from './wallet/transaction'
import { IBlock } from './dlt/block'
import { GENESIS_DATA } from './config'

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
// const pubsub = new PubSub({ blockchain, transactionPool })
const wallet = new Wallet()
// const transactionMiner = new TransactionMiner({
//   blockchain,
//   transactionPool,
//   wallet,
//   pubsub,
// })

class BlockchainService {
  constructor(public running: boolean = false) {}

  init() {
    this.running = true
    console.log('Running...')
  }

  chainState() {
    return {
      chainState: blockchain.chain,
    }
  }

  mineBlock(data: ITransaction[]) {
    const newBlock = blockchain.addBlock({ data })
    console.log(newBlock)

    return newBlock
  }

  replaceChain(chain: IBlock[]) {
    const newChain = [GENESIS_DATA, ...chain]
    blockchain.replaceChain(newChain)
  }
}

const blockchainService = new BlockchainService()

blockchainService.init()

// const chainData = blockchainService.chainState()

// 2. Adding a new block

const demoData = {
  id: 'IDENTIFICATION',
  input: {
    timestamp: 120023,
    address: 'SENDER',
    signature: 'SIGNATURE',
    amount: 10,
  },
  outputMap: {
    recipient: 'RECIPIENT',
    amount: 10,
    senderWallet: 5,
  },
}

const block1 = blockchainService.mineBlock([demoData, demoData])

blockchainService.replaceChain([block1])

const chainData = blockchainService.chainState()

console.log(chainData)

/* TODO: 

1. Synchronize Chain
2. Synchronize TransactionMap
3. Wallet Info
4. Mine Transactions - by the leader
5. Check the transaction pool
6. Transaction between two nodes

7. Mine block
8. Check chain state

*/
