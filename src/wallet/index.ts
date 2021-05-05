import { DEFAULT_REPUTATION } from '../config'
import cryptoHash from '../lib/crypto-hash'
import { ec } from '../lib/keys'
import Transaction, { TransactionOutput } from './transaction'

export default class Wallet {
  reputation: number
  keyPair: ReturnType<typeof ec.genKeyPair>
  publicKey: string

  constructor() {
    this.reputation = DEFAULT_REPUTATION

    this.keyPair = ec.genKeyPair()

    this.publicKey = this.keyPair.getPublic().encode('hex', true)
  }

  sign(data: TransactionOutput) {
    return this.keyPair.sign(cryptoHash(data))
  }

  createTransaction({
    recipient,
    amount,
  }: {
    recipient: string
    amount: number
  }) {
    // If the amount is greater than the MAX value, throw?
    if (amount > 1) {
      throw new Error('Maximum amount attempted')
    }

    // Return a transaction for this wallet
    return new Transaction({ senderWallet: this, recipient, amount })
  }
}
