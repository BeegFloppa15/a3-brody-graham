const express    = require('express'),
      app        = express(),
      dreams     = []

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )

const bruhLog = (req, res, next) =>{
    console.log("bruh")
    next()
}

// Request (req) will automatically be parsed as a JSON if the fetch request
// from the client has: headers: { 'Content-Type': 'application/json' }
app.use( express.json() )

// WHY TF ISN'T THIS WORKING?!?!
app.use(bruhLog)


app.post( '/submit', (req, res) => {
  dreams.push( req.body.newdream )
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( dreams ) )
})

app.listen( process.env.PORT || 3000)