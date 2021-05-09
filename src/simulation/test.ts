import autocannon from 'autocannon'

async function benchmark() {
  const result = await autocannon({
    url: 'http://localhost:5000/api/transact',
    connections: 1000, // node size
    duration: 300,
    // amount: 200, // block size
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      recipient: '-RECIPIENT-',
      amount: 0.8,
    }),
  })
  console.log(result)
}

benchmark()
