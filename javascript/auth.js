const cookies = require('cookie-session')
const {MongoClient} = require("mongodb")
const path = require('path')

/**
 * 
 * @param {MongoClient} mongoConnection 
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
const attemptLogin = async function (mongoConnection, req, res, next) {
    const players = mongoConnection.db('math-app').collection('players')
    const targetPlayer = await players.findOne({username: req.body.username})
    console.log('Attempting to Sign In: ' + targetPlayer.username)

    if (targetPlayer.password === undefined || req.body.password == targetPlayer.password){
        console.log("LOGIN SUCCESSFUL")
        req.session.login = true
        res.redirect('../index.html')
    }
    else{
        console.log('LOGIN FAILED')
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
const unauthRedirect = function(req, res, next){
    console.log(req.session)
    if (req.session.login === true){
        next()
    }
    else{
        res.redirect('login.html')
    }
}

module.exports = {unauthRedirect, attemptLogin}