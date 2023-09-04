const express = require('express');
const connection = require('../config2/connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config()
const multer = require('multer');
const path = require('path');
const {
    getList,
    demandeList,
    searchForPartner,
    searchForPartnerById,
    create,
    accept,
    add,
    hardDelete,
    hardDeleteAgenda,
    getAgenda,
} = require("../controllers/Partners");

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
// Initialize multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});


router.get('/getList', getList)
router.get('/demandeList', demandeList)
router.get('/searchForPartner', searchForPartner)
router.get('/searchForPartnerById', searchForPartnerById)
router.post('/create', upload.single('image'), create);
router.delete('/', hardDelete)
router.put('/accept', accept)
router.post('/add', add)
router.get('/agenda', getAgenda)
router.delete('/agenda', hardDeleteAgenda)


module.exports = router;