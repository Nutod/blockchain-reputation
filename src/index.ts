import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

import Blockchain from './dlt/blockchain'
import PubSub from './PubSub/PubSub'
import Wallet from './wallet'
import TransactionPool, { TransactionMap } from './wallet/transactionPool'
import TransactionMiner from './wallet/transactionMiner'
import { ITransaction } from './wallet/transaction'
import { IBlock } from './dlt/block'
import { GENESIS_DATA } from './config'

// All nodes are running an instance of these classes
const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const pubsub = new PubSub({ blockchain, transactionPool })
const wallet = new Wallet()
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
})

const app = express()

const DEFAULT_PORT = 5000
let PEER_PORT

const ROOT_ADDRESS = `http://localhost:${DEFAULT_PORT}`

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = process.env.PORT
}

const PORT = PEER_PORT || DEFAULT_PORT

function server() {
  app.use(cors())
  app.use(express.json())

  app.get('/', (req, res) => {
    res.json({ status: true })
  })

  app.listen(PORT, () => {
    console.log(`[SERVER] running on ${PORT}`)
  })
}

server()

// class BlockchainService {
//   constructor(public running: boolean = false) {}

//   init() {
//     this.running = true
//     console.log('Running...')
//   }

//   chainState() {
//     return {
//       chainState: blockchain.chain,
//     }
//   }

//   mineBlock(data: ITransaction[]) {
//     const newBlock = blockchain.addBlock({ data })
//     console.log(newBlock)

//     return newBlock
//   }

//   mineTransactions() {
//     // runs the creation and addition of a new block
//     transactionMiner.mineTransactions()
//   }

//   synchronizeChain(chain: IBlock[]) {
//     const newChain = [GENESIS_DATA, ...chain]
//     blockchain.replaceChain(newChain)
//   }

//   synchronizeTransactionMap(data: TransactionMap) {
//     transactionPool.setTransactionMap(data)
//   }
// }

// const blockchainService = new BlockchainService()

// blockchainService.init()

// const chainData = blockchainService.chainState()

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

// const block1 = blockchainService.mineBlock([demoData, demoData])

// Synchronize Chain
// blockchainService.synchronizeChain([block1])

// Synchronize TransactionMap
// blockchainService.synchronizeTransactionMap({
//   somedata: demoData,
// })

// console.log(transactionPool.transactionMap)

// const chainData = blockchainService.chainState()

// console.log(chainData)

/* TODO: 

3. Wallet Info
6. Transaction between two nodes

1. Synchronize Chain - for block broadcast
2. Synchronize TransactionMap - for transaction map synchronization
4. Mine Transactions - by the leader
5. Check the transaction pool
7. Mine block - will not be called directly
8. Check chain state

*/

// 1. Generate transactions that represent the transactions in the open transactions
// 2. Run consensus
