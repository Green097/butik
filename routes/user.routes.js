const User = require( '../models/user.model' );

const express = require( 'express' );
const router = express.Router();

// Håndter formdata (POST PUT)
const formData = require( 'express-form-data' );
router.use( formData.parse() );


// Login 4050/user
router.post( '/create', async ( req, res ) => {

  console.log( "POST/opret ny about" );

  try {

      let user = new User( req.body ); // req.body indeholder de data (title, content) som skal oprettes

      await user.save(); // gem i db

      return res.status( 200 ).json( { message: "Ny er oprettet", oprettet: user } );

  } catch ( error ) {

    console.log( "FEJL: ", error );
  return res.status( 500 ).json( { message: 'Problemer med serveren' } );

}

} )

 //Logout 4050/login/logout
router.get('./logout', async (req, res) =>{
    req.session.destroy(err=> {
        if(err) return res.status(500).json({message: 'logout failed'})

        //brower destroy cookie
        res.clearCookie(process.env.SESSION_NAME).json({message: 'cookie alt + f4'})
    })
})

//loggedin checkpoint 4050/login/loggedin
router.get('/loggedin', async (req, res) =>{
    if (req.session.userId){
        return res.status(200).json({message:'login active'})
    } else{
        return res.status(401).json({message: 'expired or nonexistant', login: false})
    }
})



//Get - Hent alle users
router.get( '/admin', async ( req, res ) => {

  console.log( "GET/hent Users" );

  try {

      let users = await User.find(); 

      return res.status( 200 ).json( users );

  } catch ( error ) {

      console.log( "FEJL: ", error );
      return res.status( 500 ).json( { message: 'Problemer med serveren' } );

  }

} )

//Put - ret user - user ID
router.put('/admin/:_id', async(req, res)=>{

  try{

      let user = await User.findByIdAndUpdate({_id: req.params._id}, req.body, {new: true});

      res.status(201).json({ message: "rettet", rettet: user})

  } catch(error){

      res.status(400).json({message: "error"})
  }
})

//DELETE slet user
router.delete( '/admin/:_id', async ( req, res ) => {

  console.log( "GET user fra id" );

  try {

      await User.findByIdAndDelete(req.params._id); 

      return res.status( 200 ).json( {message: "user removed"} );

  } catch ( error ) {

      console.log( "FEJL: ", error );
      return res.status( 500 ).json( { message: 'Problemer med serveren' } );

  }

} )

module.exports = router;