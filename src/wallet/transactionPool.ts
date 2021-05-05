import { IBlock } from '../dlt/block'
import type { ITransaction } from './transaction'
import Transaction from './transaction'

export interface TransactionMap {
  [id: string]: ITransaction
}
export default class TransactionPool {
  transactionMap: TransactionMap

  constructor() {
    this.transactionMap = {}
  }

  setTransaction(transaction: ITransaction) {
    this.transactionMap[transaction.id] = transaction
  }

  setTransactionMap(transactionMap: TransactionMap) {
    this.transactionMap = transactionMap
  }

  // Validating the cryptographic integrity of multiple transactions at a go
  validTransactions(): ITransaction[] {
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
