import fastify from 'fastify'
import fetch from 'node-fetch'
import { add, multiply, sqrt, divide } from 'mathjs'

import { performance, PerformanceObserver } from 'perf_hooks'

import Blockchain from './dlt/blockchain'
import PubSub from './PubSub/PubSub'
import Wallet from './wallet'
import TransactionPool from './wallet/transactionPool'
import TransactionMiner from './wallet/transactionMiner'
import Registry from './lib/registry'
import { delay } from './lib/delay'
import { TransactionOutput } from './wallet/transaction'

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

const app = fastify()

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(entry)
  })
})

perfObserver.observe({ entryTypes: ['measure'], buffered: true })

const DEFAULT_PORT = 5000
let PEER_PORT

const ROOT_ADDRESS = `http://localhost:${DEFAULT_PORT}`

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = process.env.PORT
} else {
  registry.addToRegistry(DEFAULT_PORT.toString(), wallet.publicKey)
}

const PORT = PEER_PORT || DEFAULT_PORT

function main() {
  app.get('/', (_req, reply) => {
    reply
      .status(200)
      .send({ status: true, message: 'Do you need me to do something?' })
  })

  app.get('/api/blocks', (_req, reply) => {
    reply.status(200).send({ status: true, data: blockchain.chain })
  })

  app.get('/api/transaction/pool', async (_req, reply) => {
    // await delay(500)

    reply.status(200).send(transactionPool.transactionMap)
  })

  app.get('/api/transaction/mine', async (_req, reply) => {
    // performance.mark('mining-start')

    // // Testing the block production time with block sizes
    // for (let i = 0; i < 500; i++) {
    //   await delay(50)

    //   const transaction = wallet.createTransaction({
    //     recipient: '-RECIPIENT-',
    //     amount: 0.8,
    //   })
    //   transactionPool.setTransaction(transaction)
    //   pubsub.broadcastTransaction(transaction)
    // }

    // Do a specific amount of transactions first before you mine
    transactionMiner.mineTransactions()

    // performance.mark('mining-end')

    // performance.measure('mining', 'mining-start', 'mining-end')

    reply.status(200).send({ status: true, message: 'Mined' })
  })

  app.get('/api/wallet/info', (_req, reply) => {
    const address = wallet.publicKey

    reply.send({
      status: true,
      address,
    })
  })

  app.get('/api/synchronize/peers', (_req, reply) => {
    const keyToNodeMap = registry.keyToNodeMap

    reply.send({
      status: true,
      registry: keyToNodeMap,
    })
  })

  app.get('/api/consensus/leader', async (_req, reply) => {
    let reputationMap = {} as {
      [id: string]: { reputation: number; nodeId: string }
    }

    let intermediateReputation = {} as any

    let transactionsHash = {} as { [id: string]: TransactionOutput[] }

    // go into the transaction pool
    // for all the nodes in the registry, do something by looping over all the nodes

    Object.keys(registry.keyToNodeMap).forEach((key, _index) => {
      const transactionRatingsArray: TransactionOutput[] = []
      // i is the key
      let address = registry.keyToNodeMap[key]

      for (let j in transactionPool.transactionMap) {
        let transactionOutputMap = transactionPool.transactionMap[j].outputMap

        // grab all the transactions for which i is the recipient and dump in an array
        if (transactionOutputMap.recipient === address) {
          transactionRatingsArray.push(transactionOutputMap)
        }
      }

      transactionsHash[address] = transactionRatingsArray
    })

    for (const key in registry.keyToNodeMap) {
      const nodeTransactions = transactionsHash[registry.keyToNodeMap[key]]

      let ratingsMap = nodeTransactions.map((transaction) => transaction.amount)
      let ratersReputationMap = nodeTransactions.map(
        (transaction) => transaction.senderWallet,
      )

      // get the maximum and minimum values for transaction ratings
      let maximumTransactionRating = Math.max(...ratingsMap)
      let minimumTransactionRating = Math.min(...ratingsMap)

      let normalizedRatingsMap = nodeTransactions.map((transaction) => {
        const denominator = add(
          maximumTransactionRating - minimumTransactionRating,
          1,
        )
        const numerator = add(transaction.amount - minimumTransactionRating, 1)

        const normalizedRating = Number(numerator) / Number(denominator)

        return normalizedRating
      })

      if (normalizedRatingsMap.length) {
        const normalizedRatingValue = multiply(
          normalizedRatingsMap,
          ratersReputationMap,
        )
        intermediateReputation[key] = normalizedRatingValue
      } else {
        intermediateReputation[key] = 0
      }
    }

    for (const key in registry.keyToNodeMap) {
      const ALPHA_CONST = 0.6
      const BETA_CONST = 1 - ALPHA_CONST
      const unclampedReputationValue =
        Number(multiply(ALPHA_CONST, intermediateReputation[key])) +
        Number(multiply(BETA_CONST, 0.2))

      // Apply a sigmoid function thing here to clamp all values
      const clampedReputationValueDenominator = sqrt(
        1 + unclampedReputationValue ** 2,
      )

      const clampedReputationValue = divide(
        unclampedReputationValue,
        clampedReputationValueDenominator,
      )

      // calculate reputation values

      reputationMap[key] = {
        reputation: clampedReputationValue,
        nodeId: key,
      }
    }

    reply.send({
      status: true,
      reputationMap: reputationMap,
    })
  })

  app.post('/api/transact', async (req, reply) => {
    const { amount, recipient } = req.body as {
      amount: number
      recipient: string
    }

    // simulate initial connection
    await delay(200)

    const transaction = wallet.createTransaction({ recipient, amount })
    transactionPool.setTransaction(transaction)
    pubsub.broadcastTransaction(transaction)

    reply.status(200).send({ status: true, data: transaction })
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

function synchronizeReputationChain() {}

main()

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
