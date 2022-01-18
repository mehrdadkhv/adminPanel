const mongoose = require('mongoose')
 
const articleSchema = new mongoose.Schema({

    image: {
        type: String,
        default: [true, 'a article have a name']
    },
    title: {
        type: String,
        default: [true, 'a article have a name']
    },
    author: {
        type: String,
        default: [true, 'a article have a name']
    },
    date: {
        type: String,
        default: [true, 'a article have a name']
    },
    updated: {
        type: String,
        default: 'not updated'
    },
    body: {
        type: String,
        required: true
    },

})

const Article = mongoose.model('Article' , articleSchema)

module.exports = Article;
 