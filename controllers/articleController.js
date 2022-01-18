const Article = require('./../models/articleModel')

exports.checkID = (req, res, next, val) => {
    console.log(`Article id is : ${val}`);

    if (req.params.id * 1 > articles.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Ivalid ID'
        })
    }

    next()
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(404).json({
            status: 'fail',
            message: 'missing fild '
        })
    }
}


exports.getAllArticles = (req,res)=>{
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt : req.requestTime,
        // result : articles.length,
        // data :{
        //     articles
        // }
    })

}

exports.getArticle = (req, res)=>{
    console.log(req.params);
    const id = req.params.id * 1;

    const article = article.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data : {
            article
        }
    })
}


exports.checkBody.createArticle = (req,res)=>{
    res.status(201).json({
        status: 'success',
    })
}


exports.createArticle = (req, res)=>{
    res.status(201).json({
        status: 'success',
    })
}

exports.updateArticle = (req, res)=>{
    res.status(200).json({
        status: 'success',
        data :{
            article : '< updated article here ... >'
        }
    })
}

exports.deleteArticle = (req, res)=>{
    res.status(204).json({
        status: 'success',
        data : null
    })
}