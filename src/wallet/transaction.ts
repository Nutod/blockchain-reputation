import uuid from 'uuid'
import { verifySignature } from 'src/lib/keys'
import { ec } from 'elliptic'

interface SenderWallet {
  balance?: number
  reputation: number
  keyPair: any
  publicKey: string
  sign: (params: any) => any
}

export default class Transaction {
  id: string
  input: any
  outputMap: any

  constructor({
    senderWallet,
    recipient,
    amount,
    outputMap,
    input,
  }: {
    senderWallet: SenderWallet
    recipient: string
    amount: number
    outputMap?: any
    input?: any
  }) {
    this.id = uuid.v4()
    this.outputMap =
      outputMap || this.createOutputMap({ senderWallet, recipient, amount })
    this.input =
      input || this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  createInput({
    senderWallet,
    outputMap,
  }: {
    senderWallet: SenderWallet
    outputMap: any
  }) {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
      amount: senderWallet.reputation,
    }
  }

  createOutputMap({
    senderWallet,
    recipient,
    amount,
  }: {
    senderWallet: SenderWallet
    recipient: string
    amount: number
  }) {
    // Generic function that maps sender's intrinsic value to the value to be given
    const outputMap = {} as { [id: string]: any }

    // TODO: Here, we need to make updates. How do we express the reputation values here?

    // There's two parts here, the first is the value to be given
    // The second part is the value assigned to the giver
    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.reputation - amount

    return outputMap
  }
}
