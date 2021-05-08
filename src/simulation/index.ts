import fetch from 'node-fetch'
import { DEFAULT_REPUTATION } from '../config'
import { random } from '../lib/random'
import { goodRatings } from '../_data/ratings'

// This file will interact with nodes through the API we have provided

const DEFAULT_PORT = 5000

// Only global variables needed. All other types of data are stored in nodes
let allPeerNodesMapOfRelevantInformation = {} as {
  [id: string]: { reputation: number; publicKey: string; nodeId: string }
}
let nodePortArr: string[] = []

// 1. Setup nodes for interaction
;(async function () {
  try {
    const { registry } = await (
      await fetch(`http://localhost:${DEFAULT_PORT}/api/synchronize/peers`)
    ).json()

    for (let i in registry) {
      allPeerNodesMapOfRelevantInformation[i] = {
        reputation: DEFAULT_REPUTATION,
        publicKey: registry[i],
        nodeId: i,
      }

      nodePortArr.push(i)
    }

    // This will have all the nodes and associated information

    // Do the rounds loop up here

    // 2. Generate transactions between nodes. All these transactions will be in the pool
    // generateTransactions(size = 10)
    // [5000, 5001, 5002, 5003, 5004, 5005]
    // - we divide the size by the number of nodes
    // - randomly send the request to a node from a list of possible nodes without replacement
    // - these requests should be in the transactionPools
    // - assuming that the length of the nodes are sufficiently large enough
    // size will be the block size
    // node unique interactions

    let transactionPoolSize = 6

    let numberOfRequests = transactionPoolSize / nodePortArr.length

    for (let i = 0; i < nodePortArr.length; i++) {
      let availableNodes = nodePortArr.filter((node) => node !== nodePortArr[i])

      // select one element and after interaction, add to the nodesInteractedWith array

      for (let j = 0; j < numberOfRequests; j++) {
        let selectedNode = availableNodes.shift() as string

        // send a request to the selected node
        const response = await (
          await fetch(`http://localhost:${selectedNode}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient:
                allPeerNodesMapOfRelevantInformation[selectedNode].publicKey,
              amount: goodRatings[random(goodRatings.length)],
            }),
          })
        ).json()

        console.log(response)

        // ...
      }
    }

    
    // 3. Run the consensus
    // 4. Repeat
    // 5. Benchmark
    return registry
  } catch (error) {
    console.error('Unable to fetch', error)
  }

  throw new Error('This error should not be visible')
})()
