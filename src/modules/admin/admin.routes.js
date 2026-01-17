const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const { getAllUsers } = require('./admin.controller');

router.get('/users', auth, role(['ADMIN']), getAllUsers);

module.exports = router;
