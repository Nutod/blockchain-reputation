import Block, { IBlock } from './block'
import cryptoHash from '../lib/crypto-hash'
import { REWARD_INPUT, REWARD } from '../config'
import Transaction, { ITransaction } from '../wallet/transaction'

export default class Blockchain {
  constructor(public chain: IBlock[] = [Block.genesis()]) {}

  addBlock({ data }: { data: ITransaction[] }) {
    const lastBlock = this.chain[this.chain.length - 1]
    const newBlock = Block.mineBlock({ data, lastBlock })

    this.chain.push(newBlock)

    return newBlock
  }

  static isValid(chain: IBlock[]) {
    // Valid rules implemented here
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    //  Enforce the rules for the chain
    //  This portion is still using nonce and difficulty
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, hash, lastHash, data } = chain[i]

      const actualLastHash = chain[i - 1].hash

      if (lastHash !== actualLastHash) {
        console.log('hash values do not match')
        return false
      }

      const validatedHash = cryptoHash(timestamp, data, lastHash)

      if (validatedHash !== hash) {
        console.log('hash values do not match')
        return false
      }
    }

    return true
  }

  replaceChain(
    chain: IBlock[],
    validateTransactions?: () => void,
    successCallback?: () => void,
  ) {
    if (chain.length <= this.chain.length) {
      console.log('Chain will be preserved as incoming chain is not longer')
      return
    }

    if (!Blockchain.isValid(chain)) {
      return
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error('The incoming chain has invalid data')
      return
    }

    if (successCallback) {
      successCallback()
    }

    // If nothing goes wrong, then you can replace
    this.chain = chain
  }

  validTransactionData({ chain }: { chain: IBlock[] }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      let rewardTransactionCount = 0
      const transactionSet = new Set()

      for (let transaction of block.data) {
        //   if (transaction.input.address === REWARD_INPUT.address) {
        //     rewardTransactionCount += 1

        //     if (rewardTransactionCount > 1) {
        //       console.error('Reward exceeds required limit of 1')
        //       return false
        //     }

        //     if (Object.values(transaction.outputMap)[0] !== REWARD) {
        //       console.error('Reward exceeds default config')
        //       return false
        //     }
        //   }
        if (transaction.input.address !== REWARD_INPUT.address) {
          if (!Transaction.validTransaction(transaction)) {
            console.error('Transaction not valid')
            return false
          }

          if (transactionSet.has(transaction)) {
            console.error('An identical transaction was detected')
            return false
          } else {
            transactionSet.add(transaction)
          }
        }
      }
    }
  }
}
