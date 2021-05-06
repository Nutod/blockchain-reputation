import redis from 'redis'
import Blockchain from '../dlt/blockchain'
import Registry from '../lib/registry'
import { ITransaction } from '../wallet/transaction'
import TransactionPool from '../wallet/transactionPool'

const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
  NODE: 'NODE',
}

export default class PubSub {
  publisher: redis.RedisClient
  subscriber: redis.RedisClient

  blockchain: InstanceType<typeof Blockchain>
  transactionPool: InstanceType<typeof TransactionPool>
  registry: InstanceType<typeof Registry>

  constructor({
    blockchain,
    transactionPool,
    registry,
  }: {
    blockchain: InstanceType<typeof Blockchain>
    transactionPool: InstanceType<typeof TransactionPool>
    registry: InstanceType<typeof Registry>
  }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.registry = registry

    this.publisher = redis.createClient()
    this.subscriber = redis.createClient()

    this.subscribeToChannels()

    this.subscriber.on('message', (channel, message) =>
      this.handleMessage(channel, message),
    )
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel)
    })
  }

  handleMessage(channel: string, message: string) {
    // Here, we are attempting to replace the Blockchain
    if (channel === CHANNELS.BLOCKCHAIN) {
      const parsedMessage = JSON.parse(message)

      this.blockchain.replaceChain(parsedMessage, () => {
        this.transactionPool.clearBlockchainTransaction({
          chain: parsedMessage,
        })
      })
    }

    // Here we are attempting to set transactions to the subscriber's pool
    if (channel === CHANNELS.TRANSACTION) {
      const parsedMessage = JSON.parse(message)

      this.transactionPool.setTransaction(parsedMessage)
    }

    if (channel === CHANNELS.NODE) {
      const registryInfo = message.split(',')

      this.registry.addToRegistry(registryInfo[0], registryInfo[1])
    }
  }

  publish({ channel, message }: { channel: string; message: any }) {
    // Before this node publishes, it should unsubscribe itself from the message so that
    // we don't get into the weird case of broadcasting to the publisher
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      })
    })
  }

  broadcastChain() {
    // Data is usually a string
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }

  broadcastTransaction(transaction: ITransaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    })
  }

  broadcastNode(port: number | string, publicKey: string) {
    this.publish({
      channel: CHANNELS.NODE,
      message: `${port},${publicKey}`,
    })
  }
}
