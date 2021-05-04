import { DEFAULT_REPUTATION } from 'src/config'
import cryptoHash from 'src/lib/crypto-hash'
import { ec } from 'src/lib/keys'
import Transaction from './transaction'

export default class Wallet {
  reputation: number
  keyPair: any
  publicKey: string & number[]

  constructor() {
    this.reputation = DEFAULT_REPUTATION

    this.keyPair = ec.genKeyPair()

    this.publicKey = this.keyPair.getPublic().encode('hex')
  }

  sign(data: any) {
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
