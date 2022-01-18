const Article = require('./../models/articleModel')


// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'missing fild '
//         })
//     }
// }


exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: articles.length,
            data: {
                articles
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

}

exports.getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                article
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}


// exports.checkBody.createArticle = (req,res)=>{
//     res.status(201).json({
//         status: 'success',
//     })
// }


exports.createArticle = async (req, res) => {
    try {
        // const newArticle = new Article({})
        // newArticle.save(req, res)
        const newArticle = await Article.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                article: newArticle
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data send'
        })
    }
}

exports.updateArticle = async(req, res) => {

    try {

        const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                article 
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }


}

exports.deleteArticle = async (req, res) => {
    try {
      await Article.findOneAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message : err
        })
    }
}