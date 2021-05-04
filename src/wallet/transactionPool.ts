import { IBlock } from 'src/dlt/block'
import type { ITransaction } from './transaction'
import Transaction from './transaction'

export default class TransactionPool {
  transactionMap: {
    [id: string]: any
  }

  constructor() {
    this.transactionMap = {}
  }

  setTransaction(transaction: ITransaction) {
    this.transactionMap[transaction.id] = transaction
  }

  // For replacing transaction pool after a block is added or a new node joins the network
  setTransactionMap(transactionMap: { [id: string]: any }) {
    this.transactionMap = transactionMap
  }

  // Validating the cryptographic integrity of multiple transactions at a go
  validTransactions() {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validTransaction(transaction),
    )
  }

  clear() {
    this.transactionMap = {}
  }

  clearBlockchainTransaction({ chain }: { chain: IBlock[] }) {
    // Start after the genesis block
    for (let i = 1; i < chain.length; i++) {
      const { data } = chain[i]

      for (let transaction of data) {
        console.log('Running clear transactions loop')
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id]
        }
      }
    }
  }
}
