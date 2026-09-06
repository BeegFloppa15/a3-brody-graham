const express = require( 'express' ),
      app = express()

const logger = (req,res,next) => {
  console.log( 'url:', req.url )
  next()
}

const bruh = (req, res, next) =>{
    console.log("Bruh I can't believe this bs man")
    next()
}

app.use( logger )
app.use( bruh) 
app.

app.get( '/', ( req, res ) => res.send( 'Hello World!' ) )

app.listen( process.env.PORT || 3000 )