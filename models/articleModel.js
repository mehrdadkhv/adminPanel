const mongoose = require('mongoose')
const slugify = require('slugify') 

const articleSchema = new mongoose.Schema({

    name: {
        type: String,
        default: [true, 'a article have a name']
    },
    slug: String,
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

// documen middeleware run befere .save() and .create() .insertMany
articleSchema.pre('save' , function(next) {
    this.slug = slugify(this.name,{lower: true })
    next()
})
articleSchema.pre('save', function(next) {
    console.log('will save document...');
    next();
})
articleSchema.post('save' , function(doc,next) {
    console.log(doc);
    next();
})



const Article = mongoose.model('Article' , articleSchema)

module.exports = Article;
 