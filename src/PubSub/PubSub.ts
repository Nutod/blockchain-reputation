import redis from 'redis'
import { ITransaction } from '../wallet/transaction'

const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
  CONSENSUS: 'CONSENSUS',
}

export default class PubSub {
  publisher: redis.RedisClient
  subscriber: redis.RedisClient

  blockchain: any
  transactionPool: any

  constructor({
    blockchain,
    transactionPool,
  }: {
    blockchain: any
    transactionPool: any
  }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool

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

  handleMessage(channel: string, message: any) {
    const parsedMessage = JSON.parse(message)

    // Here, we are attempting to replace the Blockchain
    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage, () => {
        this.transactionPool.clearBlockchainTransaction({
          chain: parsedMessage,
        })
      })
    }

    // Here we are attempting to set transactions to the subscriber's pool
    if (channel === CHANNELS.TRANSACTION) {
      this.transactionPool.setTransaction(parsedMessage)
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
}
