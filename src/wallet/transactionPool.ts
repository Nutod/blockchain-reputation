import { IBlock } from '../dlt/block'
import type { ITransaction } from './transaction'
import Transaction from './transaction'

export interface TransactionMap {
  [id: string]: ITransaction
}

const DEFAULT = {
  'ef27430f-90c0-4156-a9bf-e3e7e840cea5': {
    id: 'ef27430f-90c0-4156-a9bf-e3e7e840cea5',
    outputMap: {
      recipient:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105766229,
      address:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      signature: {
        r: '7b94a05bc9bc8b6e2cff8264a8534afbf929e1c0fe5c7a06add2f5873dac9bf8',
        s: 'be1014cf8ba2423322c93c2888676b81fdcf0d7f3fc82d3c36f6cde50153f472',
        recoveryParam: 0,
      },
      amount: 0.2,
    },
  },
  'd855f47b-884b-43ef-9335-cdd4a738ea51': {
    id: 'd855f47b-884b-43ef-9335-cdd4a738ea51',
    outputMap: {
      recipient:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105766470,
      address:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      signature: {
        r: 'ec4faf0aa1916ba1249df3597d38d152f7c621605f3d890b135b8405af7b995b',
        s: 'e2ceea5f1983b0d91a463a59abe34ae4b1128e1225dc6555c05c8124014cdec7',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '4bd1a664-e863-4dae-9a74-913716b3576b': {
    id: '4bd1a664-e863-4dae-9a74-913716b3576b',
    outputMap: {
      recipient:
        '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
      amount: 0.7,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105766712,
      address:
        '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
      signature: {
        r: 'f63bd818d40afc339785671ce0242dc5d469b1bb011a661bf8216ed0774f47d0',
        s: '99003ca0e7545f4955885a999b7724c402b067f773396e851fb7f701de6dbaa2',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '8fb7abc5-a0b7-49f7-aba3-8d08cb07d352': {
    id: '8fb7abc5-a0b7-49f7-aba3-8d08cb07d352',
    outputMap: {
      recipient:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      amount: 0.7,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105766964,
      address:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      signature: {
        r: 'd6d387ada42515a1f5ffb858342552c8be7e4ef1b310f723099dfea772babfc7',
        s: 'fdd86735ba096c58bf54fa795c5c7b7ebdae08d518cfa4afaf0e73285cff7290',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '0de56af2-db67-4058-936e-8d75033a7b88': {
    id: '0de56af2-db67-4058-936e-8d75033a7b88',
    outputMap: {
      recipient:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105767218,
      address:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      signature: {
        r: 'ec4faf0aa1916ba1249df3597d38d152f7c621605f3d890b135b8405af7b995b',
        s: 'e2ceea5f1983b0d91a463a59abe34ae4b1128e1225dc6555c05c8124014cdec7',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  'c38db37f-e8ee-49b3-8c8d-12030c30d13c': {
    id: 'c38db37f-e8ee-49b3-8c8d-12030c30d13c',
    outputMap: {
      recipient:
        '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
      amount: 0.7,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105767444,
      address:
        '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
      signature: {
        r: 'f63bd818d40afc339785671ce0242dc5d469b1bb011a661bf8216ed0774f47d0',
        s: '99003ca0e7545f4955885a999b7724c402b067f773396e851fb7f701de6dbaa2',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '446aa2d5-23cb-41e1-b1a0-c830b348bc07': {
    id: '446aa2d5-23cb-41e1-b1a0-c830b348bc07',
    outputMap: {
      recipient:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      amount: 0.7,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105767666,
      address:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      signature: {
        r: 'd6d387ada42515a1f5ffb858342552c8be7e4ef1b310f723099dfea772babfc7',
        s: 'fdd86735ba096c58bf54fa795c5c7b7ebdae08d518cfa4afaf0e73285cff7290',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '01a18c5b-7a04-4b3a-b122-82f839b6b5bc': {
    id: '01a18c5b-7a04-4b3a-b122-82f839b6b5bc',
    outputMap: {
      recipient:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      amount: 0.8,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105767886,
      address:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      signature: {
        r: 'a9e0437cf99de2f89e771cba439a0fb326e4f77bd1c351875ce5d54a804d1a5c',
        s: 'a8a3aa1068962edbcc0ed0f5819c8410e45eee1000272b0606ae1668e1e4cf23',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  'd1d88402-4ea6-4ec9-a5d4-e3794ae05460': {
    id: 'd1d88402-4ea6-4ec9-a5d4-e3794ae05460',
    outputMap: {
      recipient:
        '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
      amount: 0.8,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105768107,
      address:
        '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
      signature: {
        r: 'd1fc37ca637243220b4ae2a7af8aed494ca95eaf3d4fbf874d46d8fad74a4d5d',
        s: 'c16e6282c06bb61ac5caa7699caf0c97455997be66fc89aef6b4daa693c832e2',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '9b634817-3333-4871-bdad-dfaf69eb8432': {
    id: '9b634817-3333-4871-bdad-dfaf69eb8432',
    outputMap: {
      recipient:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      amount: 0.7,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105768322,
      address:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      signature: {
        r: 'd6d387ada42515a1f5ffb858342552c8be7e4ef1b310f723099dfea772babfc7',
        s: 'fdd86735ba096c58bf54fa795c5c7b7ebdae08d518cfa4afaf0e73285cff7290',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  'c889af2d-156a-4104-b7d8-b20fe0daca7f': {
    id: 'c889af2d-156a-4104-b7d8-b20fe0daca7f',
    outputMap: {
      recipient:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105768535,
      address:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      signature: {
        r: '7b94a05bc9bc8b6e2cff8264a8534afbf929e1c0fe5c7a06add2f5873dac9bf8',
        s: 'be1014cf8ba2423322c93c2888676b81fdcf0d7f3fc82d3c36f6cde50153f472',
        recoveryParam: 0,
      },
      amount: 0.2,
    },
  },
  '35365c3a-73b0-44fb-b9d3-e7da20913962': {
    id: '35365c3a-73b0-44fb-b9d3-e7da20913962',
    outputMap: {
      recipient:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105768752,
      address:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      signature: {
        r: 'ec4faf0aa1916ba1249df3597d38d152f7c621605f3d890b135b8405af7b995b',
        s: 'e2ceea5f1983b0d91a463a59abe34ae4b1128e1225dc6555c05c8124014cdec7',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  'e61f0132-1a31-4b5c-8429-c7fe6c9a4a9d': {
    id: 'e61f0132-1a31-4b5c-8429-c7fe6c9a4a9d',
    outputMap: {
      recipient:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      amount: 0.7,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105768968,
      address:
        '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
      signature: {
        r: 'd6d387ada42515a1f5ffb858342552c8be7e4ef1b310f723099dfea772babfc7',
        s: 'fdd86735ba096c58bf54fa795c5c7b7ebdae08d518cfa4afaf0e73285cff7290',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
  '3ffef13c-7b34-40c6-b837-33b935ffc473': {
    id: '3ffef13c-7b34-40c6-b837-33b935ffc473',
    outputMap: {
      recipient:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105769182,
      address:
        '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
      signature: {
        r: '7b94a05bc9bc8b6e2cff8264a8534afbf929e1c0fe5c7a06add2f5873dac9bf8',
        s: 'be1014cf8ba2423322c93c2888676b81fdcf0d7f3fc82d3c36f6cde50153f472',
        recoveryParam: 0,
      },
      amount: 0.2,
    },
  },
  'cafcb97d-057d-4ff7-a7e3-ee0a197494ab': {
    id: 'cafcb97d-057d-4ff7-a7e3-ee0a197494ab',
    outputMap: {
      recipient:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      amount: 0.9,
      senderWallet: 0.2,
    },
    input: {
      timestamp: 1621105769397,
      address:
        '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
      signature: {
        r: 'ec4faf0aa1916ba1249df3597d38d152f7c621605f3d890b135b8405af7b995b',
        s: 'e2ceea5f1983b0d91a463a59abe34ae4b1128e1225dc6555c05c8124014cdec7',
        recoveryParam: 1,
      },
      amount: 0.2,
    },
  },
}
export default class TransactionPool {
  transactionMap: TransactionMap

  constructor() {
    this.transactionMap = DEFAULT
  }

  setTransaction(transaction: ITransaction) {
    this.transactionMap[transaction.id] = transaction
  }

  setTransactionMap(transactionMap: TransactionMap) {
    this.transactionMap = transactionMap
  }

  // Validating the cryptographic integrity of multiple transactions at a go
  validTransactions(): ITransaction[] {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validTransaction(transaction),
    )
  }

  clear() {
    this.transactionMap = {}
  }

  clearBlockchainTransaction({ chain }: { chain: IBlock[] }) {
    // Start after the genesis block
    for (let i = 1; i < chain.length; i++) {
      const { data } = chain[i]

      for (let transaction of data) {
        console.log('Running clear transactions loop')
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id]
        }
      }
    }
  }
}
