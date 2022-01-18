const mongoose = require('mongoose')
 
const articleSchema = new mongoose.Schema({

    name: {
        type: String,
        default: [true, 'a article have a name']
    },
    title: {
        type: String,
        default: [true, 'a article have a name']
    },
    body: {
        type: String,
        default: [true, 'a article have a name']
    },
    summary :{
        type: String,
        default: [true, 'a article have a name']
    }
   

})

const Article = mongoose.model('Article' , articleSchema)

module.exports = Article;
 