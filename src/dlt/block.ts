import cryptoHash from 'src/lib/crypto-hash'
import { GENESIS_DATA } from 'src/config'

export interface IBlock {
  lastHash: string
  hash: string
  data: any[]
  timestamp: number
}

export default class Block {
  lastHash: string
  hash: string
  data: any[]
  timestamp: number

  constructor({
    lastHash,
    hash,
    data,
    timestamp,
  }: {
    lastHash: string
    hash: string
    data: any[]
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

  static mineBlock({ lastBlock, data }: { lastBlock: IBlock; data: any[] }) {
    // do some things here

    //  lastHash: string
    //  hash: string
    //  data: any[]
    //  timestamp: number

    const lastHash = lastBlock.hash
    const timestamp = Date.now()
    const hash = cryptoHash(timestamp, lastHash, data)

    return new this({ lastHash, hash, data, timestamp })
  }
}
