require( 'dotenv' ).config()

const express = require("express"),
      { MongoClient, ObjectId, ServerApiVersion } = require("mongodb"),
      app = express()

app.use( express.static( "public" ) )
app.use( express.json() )

const uri = process.env.MONGODB_URI
// check for sanity
console.log( 'uri:', uri )
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("sample_mflix").collection("users")

  // Testing Connection
  app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

  // Adding Document to Database
  app.post( '/add', async (req,res) => {
    const result = await collection.insertOne( req.body )
    res.json( result )
  })

  // Removing document from database 
  app.post( '/remove', async (req,res) => {
    const result = await collection.deleteOne({ 
      email: req.body.email
    })
    
    res.json( result )
  })

  // Updating document in database
  app.post( '/update', async (req,res) => {
    const result = await collection.updateOne(
      { email: req.body.email },
      { $set:{ name:req.body.name } }
    )

    res.json( result )
  })

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)