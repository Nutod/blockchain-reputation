import Block, { IBlock } from './block'

export class Blockchain {
  constructor(public chain: IBlock[] = [Block.genesis()]) {}

  addBlock({ data }: { data: any[] }) {
    const lastBlock = this.chain[this.chain.length - 1]
    const newBlock = Block.mineBlock({ data, lastBlock })

    this.chain.push(newBlock)

    return newBlock
  }
}
