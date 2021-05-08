// generateTransactions(size = 10)
// size will be the block size
// node unique interactions

;(async function () {
  let transactionPoolSize = 10
  let peerNodes = ['5000', '5001', '5002', '5003', '5004']

  let numberOfRequests = transactionPoolSize / peerNodes.length

  for (let i = 0; i < peerNodes.length; i++) {
    let availableNodes = peerNodes.filter((node) => node !== peerNodes[i])

    // select one element and after interaction, add to the nodesInteractedWith array

    for (let j = 0; j < numberOfRequests; j++) {
      let selectedNode = availableNodes.shift()
      console.log(availableNodes)
      // send a request to the selected node

      // ...
    }
  }
  // - randomly send the request to a node from a list of possible nodes without replacement
  // - these requests should be in the transactionPools
  // - assuming that the length of the nodes are sufficiently large enough
})()
