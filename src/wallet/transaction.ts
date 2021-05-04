import uuid from 'uuid'
import { verifySignature } from 'src/lib/keys'
import { ec } from 'elliptic'

interface SenderWallet {
   balance: number
   reputation: number
   keyPair: ec.KeyPairOptions

}

export class Transaction {
  id: string
  input: any
  outputMap: any

  constructor({ senderWallet, recipient, amount, outputMap, input }) {
    this.id = uuid.v4()
    this.outputMap =
      outputMap || this.createOutputMap({ senderWallet, recipient, amount })
    this.input =
      input || this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  createInput({ senderWallet, outputMap }: {}) {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
      // TODO: Optional, reputation value of the sender? Usually defaults to the starting reputation value
      amount: senderWallet.balance,
    }
  }
}
