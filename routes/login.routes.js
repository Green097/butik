const User = require( '../models/user.model' );

const express = require( 'express' );
const router = express.Router();

// Håndter formdata (POST PUT)
const formData = require( 'express-form-data' );
router.use( formData.parse() );


// Login 4050/login
router.post( '/', async ( req, res ) => {

     console.log( "POST/login" );

     try {

        const {email, password} = req.body;

        const user = await User.findOne({ email: email});

        if(!user){
            return res.status(401).json({message: "Email not in use"})
        }

        user.comparePassword(password, function(err, isMatch){

            if(err) throw err;

            if(isMatch) {
                //session-cookie
                req.session.userId = user._id;

                res.status(200).json({name: user.name, user_id: user._id})
            } else {
                return res.status(401).json({message: "password no match"})
            }
        })

     } catch ( error ) {

       console.log( "FEJL: ", error );
     return res.status( 500 ).json( { message: 'Problemer med serveren' } );

   }

 } )

 //Logout 4050/login/logout
router.get('/logout', async (req, res) =>{
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

module.exports = router;