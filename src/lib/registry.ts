export const DEFAULT = {
  '5000': '02aacdab0e4bb5359f04b62f9bf365d08a07db903886af8e542dc1006a574e388b',
  '5001': '039560d5f334b0b7b69f6d8adec59898bdc17937fd37d0406384521ef3b266000b',
  '5002': '02b8df2c0b2f3b6d365e775cab4cc1fd36c546bfdd18ee6bf91af334515d4ff2a9',
  '5003': '03e261cbadebb50774c77328378da2efeb8a834048d43d6757ae9c68ef43868514',
  '5004': '02b368546b0e00230d5ba9d2587426c648f5c6802e6860c3689d75045dfa5af004',
}

export default class Registry {
  keyToNodeMap: { [id: string]: string }

  constructor() {
    this.keyToNodeMap = {} as {
      [id: string]: string
    }
  }

  addToRegistry(id: string, publicKey: string) {
    this.keyToNodeMap[id] = publicKey
  }

  setRegistry(data: { [id: string]: string }) {
    this.keyToNodeMap = data
  }
}
