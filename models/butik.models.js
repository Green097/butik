const mongoose = require('mongoose');

const butikSchema = new mongoose.Schema({

    navn: {
        type: String
        //required: [true, 'Husk en title']
    },
    adresse: {
        type: String
        //required: [true, 'Husk produkttekst']
    },
    info: {
        type: String
    },
    opening: {
        type: Array,
        "default" : []
    },
    image: {
        type: String,
        required: [true, 'Husk et billede']
    }
})

module.exports = mongoose.model('Butik', butikSchema,'butikker');