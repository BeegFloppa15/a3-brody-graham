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

    if (targetPlayer === null){
        console.log("NO USER FOUND: LOGIN FAILED")
    }

    if (targetPlayer.password === undefined || req.body.password == targetPlayer.password){
        console.log("LOGIN SUCCESSFUL")
        req.session.login = true
        req.session.username = req.body.username
        res.redirect('../game.html')
    }
    else{
        console.log('INCORRECT PASSOWRD: LOGIN FAILED')
    }
}

/**
 * 
 * @param {MongoClient} mongoConnection 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const modifyUser = async function (mongoConnection, req, res, next){
    const players = mongoConnection.db('math-app').collection('players')
    const targetPlayer = await players.findOne({username: req.session.username})

    //Test if new Username equals another player's username
    const duplicate = await players.findOne({username: req.body.username})
    if (duplicate !== null && duplicate.username !== targetPlayer.username){
        console.log('ERROR: This username is already used')
        res.attempData = req.body
        res.redirect('/changeinfo.html?user=duplicate')
    }
    //TODO: Actually Modify User's data
    else{
        console.log('ATTEMPTING TO MODIFY USER DATA')
        let update = {$set: {username: req.body.username}, $unset:{}}
        if (req.body.firstname === '')
            update.$unset.firstname = ''
        else
            update.$set.firstname = req.body.firstname
        
        if (req.body.lastname === '')
            update.$unset.lastname = ''
        else
            update.$set.lastname = req.body.lastname

        if (req.body.password === '')
            update.$unset.password = ''
        else
            update.$set.password = req.body.password
        
        console.log(update)

        await players.updateOne({username: req.session.username}, update)
        req.session.username = req.body.username
        res.redirect('/game.html')
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

const logout = function(req, res, next){
    console.log('attempting to log out user')
    req.session = null
    res.redirect('/login.html')
}

module.exports = {unauthRedirect, attemptLogin, logout, modifyUser}