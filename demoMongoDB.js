require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI //"mongodb+srv://<db_username>:uewoBOj25mfNbbrm@assignment-3-cluster.t5xioay.mongodb.net/?appName=assignment-3-cluster";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

console.log(uri)

const wholeDatabase = client.db("sample_mflix")

const moviesCollection = wholeDatabase.collection("movies")

testGetData()

async function testGetData(){
  let estimate = await moviesCollection.estimatedDocumentCount()
  let actual = await moviesCollection.countDocuments()

  console.log("Estimated Document Count " + estimate )
  console.log("Total Documents: " + actual)

  const bestQuery = {
    "imdb.rating": {$gt: 9.0}
  }
  const worseQuery = {
    "imdb.rating": {$lt: 2.0}
  }
  const justTitle = {
    _id: 0, 
    title: 1,
    year: 1,
    "imdb.rating": 1
  }

  const theBest = await moviesCollection.find(bestQuery).project(justTitle).toArray()
  const theWorst = await moviesCollection.find(worseQuery).project(justTitle).toArray()

  console.log("The BEST Movies of all time: ", theBest)
  console.log("")
  console.log("The WORST Movies of all time: ", theWorst)

  client.close()
}


