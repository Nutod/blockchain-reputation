import cryptoHash from '../lib/crypto-hash'
import { GENESIS_DATA } from '../config'
import { ITransaction } from '../wallet/transaction'

export interface IBlock {
  lastHash: string
  hash: string
  data: ITransaction[]
  timestamp: number
}

export default class Block {
  lastHash: string
  hash: string
  data: ITransaction[]
  timestamp: number

  constructor({
    lastHash,
    hash,
    data,
    timestamp,
  }: {
    lastHash: string
    hash: string
    data: ITransaction[]
    timestamp: number
  }) {
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.timestamp = timestamp
  }

  static genesis() {
    return new this(GENESIS_DATA)
  }

  static mineBlock({
    lastBlock,
    data,
  }: {
    lastBlock: IBlock
    data: ITransaction[]
  }) {
    // do some things here

    const lastHash = lastBlock.hash
    const timestamp = Date.now()
    const hash = cryptoHash(timestamp, lastHash, data)

    return new this({ lastHash, hash, data, timestamp })
  }
}
