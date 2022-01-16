const express = require('express');
const adminPanelController = require('../../controllers/admin/HomeController')

const router = express.Router();

router.route('/').get(adminPanelController.index);

module.exports = router;