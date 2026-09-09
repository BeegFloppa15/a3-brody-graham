require( 'dotenv' ).config()
const uri = process.env.MONGODB_URI
console.log(uri)
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb")
const mongoConnection = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

// Problems from the Database
const mathDb = mongoConnection.db('math-app')
const problemSet = mathDb.collection('problems')
let randProblem = problemSet.aggregate([{$sample: { size:1}}])

async function BRO_PLEEEEESE(){
    let problemData = await randProblem.next()
    console.log(problemData.problem)

    randProblem = problemSet.aggregate([{$sample: { size:1}}])
    problemData = await randProblem.next()
    console.log(problemData)

    randProblem = problemSet.aggregate([{$sample: { size:1}}])
    problemData = await randProblem.next()
    console.log(problemData)

    randProblem = problemSet.aggregate([{$sample: { size:1}}])
    problemData = await randProblem.next()
    console.log(problemData)

    await mongoConnection.close()
}


BRO_PLEEEEESE()
