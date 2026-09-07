// Importing express module and creating the server's app object
const express = require( 'express' ),
      app = express()
      dreams = []

// Declaring Middleware functions. Signature = (request, response, nextFunction())
const logger = (req,res,next) => {
  console.log( 'url:', req.url )
  next()
}

const middleware_post = ( req, res, next ) => {
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data 
  })

  req.on( 'end', function() {
    const json = JSON.parse( dataString )
    dreams.push( json )

    // add a 'json' field to our request object
    // this field will be available in any additional
    // routes or middleware.
    req.json = JSON.stringify( dreams )

    // advance to next middleware or route
    next()
  })
}

// Connecting middleware functions
app.use( logger ) // Logger gets called on any method type (GET, POST, DELETE, PUT)
app.post('/submit', middleware_post)  // Middleware_post gets called when post method type is received with the URL /submit
app.post( '/submit', ( req, res ) => {
  // our request object now has a 'json' field in it from our previous middleware
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
  // NOTE: You could just have this functionality in the middleware_post function, but
  // this is to demonstrate how you can create multiple middleware functions for the post
  // call that get called in order
})

// Serving Static Files. By default, going to the base URL will server index.html
app.use( express.static('public'))

app.listen( process.env.PORT || 3000 )