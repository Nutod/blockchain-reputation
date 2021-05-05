// 1. Generate transactions that represent the transactions in the open transactions
// 2. Run consensus

import Blockchain from './dlt/blockchain'
import PubSub from './PubSub/PubSub'
import Wallet from './wallet'
import TransactionPool from './wallet/transactionPool'
import TransactionMiner from './wallet/transactionMiner'
import { ITransaction } from './wallet/transaction'

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
      data: blockchain.chain,
    }
  }

  mineBlock(data: ITransaction[]) {
    blockchain.addBlock({ data })
  }
}

const blockchainService = new BlockchainService()

blockchainService.init()

const chainData = blockchainService.chainState()

// 2. Adding a new block

// export interface ITransaction {
//   id: string
//   input: TransactionInput
//   outputMap: any
// }

// interface TransactionInput {
//   timestamp: number
//   address: string
//   signature: any
//   amount: number
// }
const demoData = {
  id: 'asfjvnafv',
  input: {
    timestamp: 120023,
    address: 'sdkfskd',
    signature: 'asfkvjsndfb',
    amount: 12,
  },
  outputMap: {
    
  }
}
