const express = require('express');
const connection = require('../config2/connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config()
const {
    loggin,
    register,
    getList,
    hardDelete,
    forget_password,
    reset_password,
    update_password,
} = require("../controllers/client")


router.post('/signup', register);
router.post('/login', loggin)
router.delete('/', hardDelete)
router.post('/forget_password', forget_password)
router.get('/reset_password/:id/:token', reset_password)
router.post('/reset_password/:id/:token', update_password)

router.get('/getList', getList)


router.get('/decodeToken', (req, res) => {
    var token = req.headers.authorization;
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    res.send({ success: true, user: decoded.user });
})



module.exports = router;