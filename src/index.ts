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
const pubsub = new PubSub({ blockchain, transactionPool })
const wallet = new Wallet()
// const transactionMiner = new TransactionMiner({
//   blockchain,
//   transactionPool,
//   wallet,
//   pubsub,
// })

function blockchainService() {
  return {
    init() {
      console.log('Running...')
    },
    getBlockchain() {
      return {
        status: true,
        data: blockchain.chain,
      }
    },
    // called during consensus
    mineBlock(data: ITransaction[]) {
      blockchain.addBlock({ data })
    },
    // called between two nodes
    transact() {},
  }
}

blockchainService().init()
const initialBlockData = blockchainService().getBlockchain()

console.log(initialBlockData)
