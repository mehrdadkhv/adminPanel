const express = require('express');
const adminPanelController = require('../../controllers/admin/adminController')
const userController = require('../../controllers/userController');

const router = express.Router();



//users routes
router
.route('/users')
.get(userController.getAllusers)
.post(userController.createUser);
<<<<<<< HEAD


=======
>>>>>>> 552e189660ed0c0b7d1f905821255eb0224d683b
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