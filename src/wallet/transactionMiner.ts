import Transaction from './transaction'

export default class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.pubsub = pubsub
  }

  mineTransactions() {
    // Get valid transactions from the pool
    const validTransactions = this.transactionPool.validTransactions()

    // Incentivise the node that adds a new block
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet }),
    )

    // Add the new block to the chain
    this.blockchain.addBlock({ data: validTransactions })

    // Broadcast the new block
    this.pubsub.broadcastChain()

    // Clear the transaction pool
    this.transactionPool.clear()
  }
}
