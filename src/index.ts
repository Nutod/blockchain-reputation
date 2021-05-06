import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

import Blockchain from './dlt/blockchain'
import PubSub from './PubSub/PubSub'
import Wallet from './wallet'
import TransactionPool from './wallet/transactionPool'
import TransactionMiner from './wallet/transactionMiner'
import Registry from './lib/registry'
import { delay } from './lib/delay'

// All nodes are running an instance of these classes
const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()
const registry = new Registry()
const pubsub = new PubSub({ blockchain, transactionPool, registry })
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
} else {
  registry.addToRegistry(DEFAULT_PORT.toString(), wallet.publicKey)
}

const PORT = PEER_PORT || DEFAULT_PORT

function server() {
  app.use(cors())
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({ status: true, message: 'Do you need me to do something?' })
  })

  app.get('/api/blocks', (_req, res) => {
    res.status(200).json({ status: true, data: blockchain.chain })
  })

  app.get('/api/transaction/pool', (_req, res) => {
    res.status(200).json(transactionPool.transactionMap)
  })

  app.get('/api/transaction/mine', (_req, res) => {
    transactionMiner.mineTransactions()

    res.status(200).json({ status: true, message: 'Mined' })
    // res.redirect('/api/blocks')
  })

  app.get('/api/wallet/info', (_req, res) => {
    const address = wallet.publicKey

    res.json({
      status: true,
      address,
    })
  })

  app.get('/api/synchronize/peers', (_req, res) => {
    const keyToNodeMap = registry.keyToNodeMap

    res.json({
      status: true,
      registry: keyToNodeMap,
    })
  })

  app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body as {
      amount: number
      recipient: string
    }

    const transaction = wallet.createTransaction({ recipient, amount })
    transactionPool.setTransaction(transaction)
    pubsub.broadcastTransaction(transaction)
    console.log('Pool', transactionPool)

    res.status(200).json({ status: true, data: transaction })
  })

  app.listen(PORT, async () => {
    console.log(`[SERVER] running on ${PORT}`)

    if (PORT !== DEFAULT_PORT) {
      console.log('Syncing...')
      synchronizeChain()
      synchronizeTransactionMap()

      pubsub.broadcastNode(PORT, wallet.publicKey)

      await delay(5000)
      synchronizePeers()
    }
  })
}

function synchronizeChain() {
  fetch(`${ROOT_ADDRESS}/api/blocks`)
    .then((res) => {
      if (res.ok === true) {
        return res.json()
      } else {
        return Promise.reject({ message: 'Error occurred' })
      }
    })
    .then(({ data }) => blockchain.replaceChain(data))
    .catch((err) => console.error(err))
}

function synchronizeTransactionMap() {
  fetch(`${ROOT_ADDRESS}/api/transaction/pool`)
    .then((res) => {
      if (res.ok === true) {
        return res.json()
      } else {
        return Promise.reject({ message: 'Error occurred' })
      }
    })
    .then((data) => {
      transactionPool.setTransactionMap(data)
    })
    .catch((err) => console.error(err))
}

function synchronizePeers() {
  fetch(`${ROOT_ADDRESS}/api/synchronize/peers`)
    .then((res) => {
      if (res.ok === true) {
        return res.json()
      } else {
        return Promise.reject({ message: 'Error occurred' })
      }
    })
    .then(({ registry: registryData }) => {
      registry.setRegistry(registryData)
    })
    .catch((err) => console.error(err))
}

server()

// TODO: Add static keys? Use a key registry? Class manages all keys mapped to ports

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

/*  

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
