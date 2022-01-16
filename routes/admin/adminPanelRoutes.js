const express = require('express');
const adminPanelController = require('../../controllers/admin/HomeController')
const userRouter = require('./routes/userRoutes');

const router = express.Router();

router.route('/').get(adminPanelController.index);
router.route('/users', userRouter)

module.exports = router;