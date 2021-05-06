import { v4 } from 'uuid'
import Wallet from '.'
import { verifySignature } from '../lib/keys'

export interface ITransaction {
  id: string
  input: TransactionInput
  outputMap: TransactionOutput
}

interface TransactionInput {
  timestamp: number
  address: string
  signature: any
  amount: number
}

export interface TransactionOutput {
  recipient: string
  amount: number
  senderWallet: number
}

export default class Transaction {
  id: string
  input: TransactionInput
  outputMap: TransactionOutput

  constructor({
    senderWallet,
    recipient,
    amount,
    outputMap,
    input,
  }: {
    senderWallet: InstanceType<typeof Wallet>
    recipient: string
    amount: number
    outputMap?: TransactionOutput
    input?: TransactionInput
  }) {
    this.id = v4()
    this.outputMap =
      outputMap || this.createOutputMap({ senderWallet, recipient, amount })
    this.input =
      input || this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  createInput({
    senderWallet,
    outputMap,
  }: {
    senderWallet: InstanceType<typeof Wallet>
    outputMap: TransactionOutput
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
    senderWallet: InstanceType<typeof Wallet>
    recipient: string
    amount: number
  }) {
    // Generic function that maps sender's intrinsic value to the value to be given
    const outputMap = {} as TransactionOutput

    outputMap['recipient'] = recipient
    outputMap['amount'] = amount
    outputMap['senderWallet'] = senderWallet.reputation

    return outputMap
  }

  static validTransaction(transaction: ITransaction) {
    // Maximum value that can be given to another participant

    const { outputMap, input } = transaction
    const { signature, address } = input

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error('Invalid Signature detected')
      return false
    }

    return true
  }
}
