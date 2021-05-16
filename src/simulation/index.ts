import fetch from 'node-fetch'
import { DEFAULT_REPUTATION } from '../config'
import { random } from '../lib/random'
import { goodRatings } from '../_data/ratings'

import { performance, PerformanceObserver } from 'perf_hooks'
import { delay } from '../lib/delay'

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(entry)
  })
})

perfObserver.observe({ entryTypes: ['measure'], buffered: true })

// This file will interact with nodes through the API we have provided

// Managing the reputation status here

const DEFAULT_PORT = 5000

// Only global variables needed. All other types of data are stored in nodes
let allPeerNodesMapOfRelevantInformation = {} as {
  [id: string]: { reputation: number; publicKey: string; nodeId: string }
}
let nodePortArr: string[] = ['5000']
let reputationMap: { key: string; value: number; nodeId: string }[] = []
let consensusNodes: { key: string; value: number; nodeId: string }[] = []

// 1. Setup nodes for interaction
;(async function () {
  try {
    const { registry } = await (
      await fetch(`http://localhost:${DEFAULT_PORT}/api/synchronize/peers`)
    ).json()

    for (let i in registry) {
      const TRIAL_REPUTATION_VALUE = DEFAULT_REPUTATION
      allPeerNodesMapOfRelevantInformation[i] = {
        reputation: TRIAL_REPUTATION_VALUE,
        publicKey: registry[i],
        nodeId: i,
      }

      nodePortArr.push(i)
      reputationMap.push({
        key: registry[i],
        value: TRIAL_REPUTATION_VALUE,
        nodeId: i,
      })
    }

    console.log(reputationMap)

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

    // refers to the number of transactions in the pool
    let transactionPoolSize = 12

    let numberOfRequests = transactionPoolSize / nodePortArr.length

    // console.log(numberOfRequests)

    for (let i = 0; i < nodePortArr.length; i++) {
      let availableNodes = nodePortArr.filter((node) => node !== nodePortArr[i])

      // select one element and after interaction, add to the nodesInteractedWith array

      for (let j = 0; j < 10; j++) {
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

    // At this point, the transactions are done, we can move on to the consensus part
    // start by selecting the committee
    // - sort the values first
    reputationMap = reputationMap.sort((a, b) => b.value - a.value)

    // - check what 50% of the reputation value is
    const totalReputationScore = reputationMap.reduce(
      (acc, cur) => acc + cur.value,
      0,
    )

    const averageReputationScore = totalReputationScore / 2
    let reputationScoreSum = 0

    console.log(averageReputationScore)

    // take the first node in the array and dump, update the score
    // if it's more than the threshold, break from the loop
    for (let i = 0; i < reputationMap.length; i++) {
      if (reputationScoreSum < averageReputationScore) {
        // add to the array
        consensusNodes.push(reputationMap[i])
        // update the reputation score sum
        reputationScoreSum += reputationMap[i].value
      } else {
        break
      }
    }

    performance.mark('consensus-start')

    // consensus can start here
    console.log(consensusNodes)
    // - select nodes that have reputation values that match the figure

    // randomly select the leader
    const consensusLeader = consensusNodes[random(consensusNodes.length)]
    const consensusGroupNodes = consensusNodes.filter(
      (node) => consensusLeader.key !== node.key,
    )

    // let the leader do all the other calculations
    // send a request to the leaders endpoint that has computation thing and wait for the result
    const reply = await (
      await fetch(
        `http://localhost:${consensusLeader.nodeId}/api/consensus/leader`,
      )
    ).json()

    console.log(reply)

    // package the block, calculate new reputation values

    for (let j = 0; j < consensusGroupNodes.length; j++) {
      await delay(200)
    }

    const mineBlockResponse = await (
      await fetch(
        `http://localhost:${consensusLeader.nodeId}/api/transaction/mine`,
      )
    ).json()

    console.log(mineBlockResponse)
    // /api/transaction/mine
    // every other member of the committee can then verify the proposition
    // send a request to all the nodes and wait for their responses

    // broadcast the chain to the rest of the population
    // leader can then broadcast this result to the result of the network

    performance.mark('consensus-end')

    performance.measure('consensus', 'consensus-start', 'consensus-end')

    // 3. Run the consensus
    // 4. Repeat
    // 5. Benchmark
    return registry
  } catch (error) {
    console.error('Unable to fetch', error)
  }

  throw new Error('This error should not be visible')
})()
