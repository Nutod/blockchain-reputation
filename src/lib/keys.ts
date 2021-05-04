import Elliptic from 'elliptic'
import cryptoHash from './crypto-hash'

const EC = Elliptic.ec

export const ec = new EC('secp256k1')

export function verifySignature({
  publicKey,
  data,
  signature,
}: {
  publicKey: string
  data: any
  signature: any
}) {
  // Retrieving the private from the public
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

  // Return a Boolean as you might expect
  return keyFromPublic.verify(cryptoHash(data), signature)
}
