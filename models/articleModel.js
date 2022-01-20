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
    },
    images : [String],
    secretArticle : {
        type:Boolean,
        default: false
    }
   

})

// documen middeleware run befere .save() and .create() .insertMany
articleSchema.pre('save' , function(next) {
    this.slug = slugify(this.name,{lower: true })
    next()
})

//  qury middleware
// articleSchema.pre(/^find/, function(next) {
//     this.find({secretArticle : {$ne : true}})

//     this.start = Date.now();
//     next();
// })
// articleSchema.post(/^find/,function(docs,next) {
//     console.log(`Query took ${Date.now()-this.start} milliseconds`);
//     console.log(docs);
//     next();
// })



const Article = mongoose.model('Article' , articleSchema)

module.exports = Article;
 