const Butik = require('../models/butik.models')

const express = require('express');
const router = express.Router();

const multer = require('multer');

//Multer filhåntering (billeder pdf)
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,'public/images/')
        },
        filename: function(req, file, cb){
            //cb(null, file.originalname)
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

//Get - Hent alle butikker
router.get( '/', async ( req, res ) => {

    console.log( "GET/hent Butikker" );

    try {

        let butikker = await Butik.find(); 

        return res.status( 200 ).json( butikker );

    } catch ( error ) {

        console.log( "FEJL: ", error );
        return res.status( 500 ).json( { message: 'Problemer med serveren' } );

    }

} )

//Get - Hent et udvalgt butik - butik ID
router.get( '/:_id', async ( req, res ) => {

    console.log( "GET butik fra id" );

    try {

        let butik = await Butik.findById(req.params._id); 

        //if ( butik == null ) {
        //    return res.status( 404 ).json({});
        //}

        return res.status( 200 ).json( butik );

    } catch ( error ) {

        console.log( "FEJL: ", error );
        return res.status( 500 ).json( { message: 'Problemer med serveren' } );

    }

} )

//Get - søge efter butik - søgeord
router.get( '/search/:searchkey', async ( req, res ) => {

    console.log( "GET butik fra søgeord", req.params.searchkey );

    try {
            //$or = der søges
        let butikker = await Butik.find({
            $or:[
                {navn:{$regex: req.params.searchkey, $options: "i"}}, 
                {adresse:{$regex: req.params.searchkey, $options: "i"}}
                //{image:{$regex: req.params.searchkey, $options: "i"}}
            ]
        }); 

        return res.status( 200 ).json( butikker );

    } catch ( error ) {

        console.log( "FEJL: ", error );
        return res.status( 500 ).json( { message: 'Problemer med serveren' } );

    }

} )

//Post - ny butik
router.post('/admin', upload.single('image'), async(req, res)=>{

    try{

        let butik = new Butik(req.body);
        butik.image = req.file.filename;
        //butik.image = req.file ? req.file.filename: 'placeholder.jpg'
        butik = await butik.save();

        res.status(201).json({ message: "ny oprettet", oprettet: butik})

    } catch(error){

        res.status(400).json({message: "error"})
    }
})

//Put - ret butik - butik ID
router.put('/admin/:_id', upload.single('image'), async(req, res)=>{

    try{
        if(req.file){
            //erstatter gl. image med nyt
            req.body.image = req.file.filename
        }

        let butik = await Butik.findByIdAndUpdate({_id: req.params._id}, req.body, {new: true});

        res.status(201).json({ message: "ny oprettet", oprettet: butik})

    } catch(error){

        res.status(400).json({message: "error"})
    }
})

//DELETE slet butik
router.delete( '/admin/:_id', async ( req, res ) => {

    console.log( "GET butik fra id" );

    try {

        await Butik.findByIdAndDelete(req.params._id); 

        return res.status( 200 ).json( {message: "butik removed"} );

    } catch ( error ) {

        console.log( "FEJL: ", error );
        return res.status( 500 ).json( { message: 'Problemer med serveren' } );

    }

} )

module.exports = router;