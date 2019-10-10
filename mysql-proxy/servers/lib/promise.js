// hack: drop-in replacement for Promise.all(promises) that evaluates the list of promises sequentially
// use:  in the context of sending multiple queries in single HTTP POST,
//         - they need to be handed to the mysql2 client individually
//         - they need to be evaluated by the database server in the correct order

Promise.seq = function(promises) {
  return new Promise(async (resolve, reject) => {
    const result = []

    for (let i=0; i < promises.length; i++) {
      try {
        let val = await promises[i]
        result[i] = val
      }
      catch(e) {
        result[i] = e
        reject(result)
        return
      }
    }
    resolve(result)
  })
}
