// 1. Generate transactions that represent the transactions in the open transactions
// 2. Run consensus

import Blockchain from './dlt/blockchain'
import PubSub from './PubSub/PubSub'
import Wallet from './wallet'
import TransactionMiner from './wallet/transactionMiner'
import TransactionPool from './wallet/transactionPool'

const blockchain = new Blockchain()

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
  }
}

blockchainService().init()
const initialBlockData = blockchainService().getBlockchain()

console.log(initialBlockData)
