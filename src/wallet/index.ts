import { DEFAULT_REPUTATION } from 'src/config'
import { ec } from 'src/lib/keys'

class Wallet {
  reputation: number
  keyPair: any
  publicKey: string & number[]

  constructor() {
    this.reputation = DEFAULT_REPUTATION

    this.keyPair = ec.genKeyPair()

    this.publicKey = this.keyPair.getPublic().encode('hex')
  }
}
