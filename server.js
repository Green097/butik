const express = require( 'express' );
require( 'dotenv' ).config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT; // hent portnummer fra env-fil


// ---- DB Mongo og Mongoose
// ------------------------------------------------------------
const mongoose = require( 'mongoose' );

//Lokal DB
mongoose.connect( process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true } );

//Ekstern DB
//mongoose.connect( process.env.DB_URL_EXT, { useNewUrlParser: true, useUnifiedTopology: true } );

const db = mongoose.connection; // skab forbindelse til MongoDB
db.on( 'error', ( error ) => console.log( "FEJL: " + error ) )
db.once( 'open', () => console.log( "/// ----> MongoDB er klar!" ) )

//---- SESSION
const session = require ('express-session');
const MongoStore = require('connect-mongo');

const expire = 1000*60 //1min

app.use( session( {
    name: process.env.SESSION_NAME,
    //rolling + resave true = refresher login cookie
    resave: true, // skal session resaves ved aktivitet
    rolling: true,
    saveUninitialized: false, // 
    store: MongoStore.create( { mongoUrl: process.env.DB_URL } ),
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: expire,
        sameSite: 'strict', // 'none' 'lax'
        secure: false, // hvis https så skift til true
        httpOnly: true, // vigtigt - session-cookie som ikke kan manipuleres med javascript
    }
 
} ) );


//AUTH Checker
app.use('*/admin*', async(req, res, next) =>{
   //if logged in
 if (req.session && req.session.userId){
      return next();

  } else {
   //if not logged in
      return res.status(401).json({message: 'access denied'})
  }

})




// ---- APP
// ------------------------------------------------------------
app.use(express.json() );                              // håndter POST/PUT data som json
app.use(express.urlencoded( { extended: true } ) );    // håndter POST/PUT data som urlencoded-data
app.use(cors({ credentials:true, origin: true}));
app.use(express.static('public'));


// ---- ROUTES
// ------------------------------------------------------------

// serverens endpoint - "landingpage"
app.get( '/', async ( req, res ) => {

    console.log( "Serverens endpoint!" );
    return res.status( 200 ).json( { message: 'Hilsen fra server' } );

} )

app.use( '/user', require('./routes/user.routes'));
app.use( '/login', require('./routes/login.routes'));
app.use( '/butik', require('./routes/butik.routes'));


// ---- LISTEN
// ------------------------------------------------------------
app.listen( PORT, () =>
    console.log( '/// ----> Serveren lytter på port: ' + PORT )
)



// console.log("TEST")
