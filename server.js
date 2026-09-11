require( 'dotenv' ).config()

//Importing and creating server
const express = require( 'express' )
const app = express()
const {unauthRedirect, attemptLogin, logout} = require('./javascript/auth')
const cookie = require('cookie-session')

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

// Problems from the Database
const problemSet = mongoConnection.db('math-app').collection('problems')
// Player collection from the Database
const players = mongoConnection.db('math-app').collection('players')

// Utility Logger Middleware
const logger = (req, res, next) => {
    console.log("url: " + req.url)
    next()
}

/**
 * 
 * @param {Request} req Attatches array of top 5 users as req.topFive
 * @param {Response} res 
 * @param {function} next 
 */
const getTopFiveUsers = async function(req, res, next){
    const topFiveAgg = [
        {'$sort': {'correct_guesses': -1}}, 
        {'$limit': 5}
    ];

    const topFive = await players.aggregate(topFiveAgg).toArray()
    req.topFive = topFive

    next()
}

/**
 * Asyncronously gets a problem from the database, adds it to req.newProblem
 * @param {Request} req HTTP Request. After function call, you can access req.newProblem
 * @param {Response} res HTTP Response. Not Sent in this function.
 * @param {function} next 
 */
const getRandomProblem = async function(req, res, next){
    console.log("We shouldnt' reach this?!?!")
    let problemCursor = problemSet.aggregate([{$sample: { size:1}}])
    let newProblem = await problemCursor.next()
    
    console.log("Sending Problem: ", newProblem.problem)
    req.newProblem = newProblem
    next()
}

/**
 * Middleware that checks if the player answered the question correctly
 * @param {Request} req - Expected to have problem, answer, and username in body. 
 * Attatches req.is_correct and req.playerData
 * @param {Response} res 
 * @param {function} next 
 */
const checkAnswer = async function(req, res, next){
    console.log(req.body)

    const problemData = await problemSet.findOne({'problem': req.body.problem})

    if (problemData.solution === parseInt(req.body.answer) 
        || problemData.alt_solutions.includes(req.body.answer)){
        console.log("CORRECT")
        req.is_correct = 'correct'
        
        //Modify user data in DB
        await players.updateOne({'username': req.body.username}, 
            {$inc: {correct_guesses: 1, total_guesses: 1}})
        
    }
    else{
        console.log("INCORRECT")
        req.is_correct = 'incorrect'

        //modify user data in DB
        await players.updateOne({'username': req.body.username}, 
            {$inc: {total_guesses: 1}})
    }

    const playerUpdatedStats = await players.findOne({'username': req.body.username})
    req.playerData = playerUpdatedStats

    next()
}

app.use( express.urlencoded({ extended:true }) )
app.use(express.json())
app.use(logger)

app.use(cookie({
    name: 'session',
    keys: [
        process.env.KEY1,
        process.env.KEY2,
        process.env.KEY3,
        process.env.KEY4
    ]
}))



// TODO: Handle app redirecting from login to main page, serving a problem there
app.get('/', unauthRedirect)
app.get('/index.html', unauthRedirect)
app.use('/login.html', (req, res, next)=>{
    if (req.session.login === true){
        console.log('User logged in, sending to home page')
        res.redirect('../index.html')
    }
    else
        console.log('Log In Required')
        next()
})
app.post('/login/attempt', express.json(), async function (req, res, next){
    console.log('Login Attempted!')
    console.log(req.body)
    await attemptLogin(mongoConnection, req, res, next)
    next()
})

app.use('/logout', logout)

app.get("/new-problem", getRandomProblem)
app.get("/new-problem", (req, res) =>{
    let message = {
      "problem": req.newProblem.problem,
      "leaderboard": undefined
    }

    res.writeHead(200, "OK", {'Content-Type': 'application/json' })
    res.end(JSON.stringify(message))
})



/*
app.post('/submit', checkAnswer)
app.post('/submit', getRandomProblem)
app.post('/submit', (req, res) =>{
    let message = {
        "problem": req.newProblem.problem,
        "is_correct": req.is_correct,
        "user_data": req.playerData
    }
    console.log("Sending Message: " + JSON.stringify(message))

    res.writeHead(200, "OK", {'Content-Type': 'application/json' })
    res.end(JSON.stringify(message))
})
    */

app.use(express.static('public'))

app.listen(3000)