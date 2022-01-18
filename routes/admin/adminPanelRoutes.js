const express = require('express');
const adminPanelController = require('../../controllers/admin/adminController')
const userController = require('../../controllers/userController');
const articleController = require('')

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

//articles routes
router
    .route('/articles')



router.route('/').get(adminPanelController.index);

module.exports = router;