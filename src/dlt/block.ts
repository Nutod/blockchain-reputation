import cryptoHash from 'src/lib/crypto-hash'
import hexToBinary from 'hex-to-binary'
import { GENESIS_DATA } from 'src/config'

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
}
