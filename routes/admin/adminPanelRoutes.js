const express = require('express');
const adminPanelController = require('../../controllers/admin/adminController')
const userController = require('../../controllers/userController');
const articleController = require('../../controllers/articleController')
const authController = require('../../controllers/authController')

const router = express.Router();



//users routes
router
    .route('/users')
    .get(userController.getAllusers)
    .post(userController.createUser);
router
    .route('/user/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


// articles routes
router
    .route('/articles')
    .get(authController.protect,
        //نقش ها در تابع محدود کننده نوشته شدند
        authController.restrictTo('admin', 'lead-admin'),
        articleController.getAllArticles)
    .post(articleController.createArticle);
router
    .route('/articles/:id')
    .get(articleController.getArticle)
    .patch(articleController.updateArticle)
    .delete(
        authController.protect,

        articleController.deleteArticle
    )


// home route
router.route('/').get(adminPanelController.index);


module.exports = router;