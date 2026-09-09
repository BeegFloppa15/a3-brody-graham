require( 'dotenv' ).config()

//Importing and creating server
const express = require( 'express' )
const app = express()

const CHANGE = require( './javascript/problems' )
const player = require('./javascript/player')

//Importing and creating MongoDB connection
const uri = process.env.MONGODB_URI
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb")
const mongoConnection = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

// Temporary player data map from the old server
// TODO: Replace this with the database schema
const playerData = new player.Leaderboard();

// Problems from the Database
const problemSet = mongoConnection.db('math-app').collection('problems')

// Utility Logger Middleware
const logger = (req, res, next) => {
    console.log("url: " + req.url)
    //console.log("type: " + req.headers.get('Content-Type'))
    next()
}

/**
 * Asyncronously gets a problem from the database, adds it to req.newProblem
 * @param {Request} req HTTP Request. After function call, you can access req.newProblem
 * @param {Response} res HTTP Response. Not Sent in this function.
 * @param {function} next 
 */
const getRandomProblem = async function(req, res, next){
    let problemCursor = problemSet.aggregate([{$sample: { size:1}}])
    let newProblem = await problemCursor.next()
    console.log(newProblem)
    req.newProblem = newProblem
    next()
}

app.use(express.json())
app.use(logger)
app.use(express.static('public'))

// TODO: Handle app redirecting from login to main page, serving a problem there
app.get("/new-problem", getRandomProblem)
app.get("/new-problem", (req, res) =>{
    let message = {
      "problem": req.newProblem.problem,
      "leaderboard": playerData.board
    }

    res.writeHead(200, "OK", {'Content-Type': 'application/json' })
    res.end(JSON.stringify(message))
})

app.post('/submit', (req, res) =>{
    console.log(req.body)

    let reply = {
        "all-players": undefined,
        "problem": undefined
    }

    // Check if the answer is correct
    let answers = CHANGE.problemMap.get(req.body.problem)
    if (answers.includes(parseInt(req.body.answer))){
        console.log("CORRECT!")

        // Update Player's stats in memory
        playerData.correctAnswer(req.body.username)

        // Serve player data and a new problem
        reply.problem = CHANGE.randomProblem()
        
    }
    // Answer is wrong
    else {
        console.log("INCORRECT!")

        // Update Player's stats in memory
        playerData.incorrectAnswer(req.body.username)
    }
    reply['all-players'] = playerData.board

    // Send data to the client: includes "problem" if they got it right
    res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    res.end(JSON.stringify(reply))
})

app.listen(3000)
//mongoConnection.close()