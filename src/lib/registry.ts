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
