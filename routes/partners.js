const express = require('express');
const connection = require('./../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config()
const multer = require('multer');
const path = require('path');

router.get('/getList', (req, res) => {
    query = "SELECT * from partners where state = 1"
    connection.query(query, [], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.get('/demandeList', (req, res) => {
    query = "SELECT * from partners where state = 0"
    connection.query(query, [], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

router.get('/searchForPartner', (req, res) => {
    const params = req.query;
    const region = params.region;
    const keywords = params.keywords;
    query = "SELECT * FROM `partners`,`regions` WHERE partners.region_id = regions.id_region AND  partners.state = 1 AND partners.region_id = ? AND partners.name LIKE '%" + keywords + "%'"
    connection.query(query, [region], (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
router.get('/searchForPartnerById', (req, res) => {
    const params = req.query;
    const id = params.id;
    query = "SELECT * FROM `partners`,`regions` WHERE (partners.region_id = regions.id_region AND partners.`id` = ?  )"
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(
            {
            success:true,
        
                data: result[0]
            }
            );
    })
})

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
router.post('/create', upload.single('image'),(req, res) => {
    let body = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
      }
      const imagePath = req.file.path;

    var query = "INSERT INTO `partners` (`name`, `logo_url`, `phone`, `email`, `website`, `maps`, `about`, `region_id`, `state`) VALUES ?";
    var values = [
        [
            body.name,
            imagePath,
            body.phone,
            body.email,
            body.website,
            body.maps,
            body.about,
            body.region_id,
            0
        ]
    ];

    connection.query(query, [values], (err, result) => {
        if (err) throw err;
        res.send({
            code: 200,
            success: true,
            message: "Partenaire ajouté avec succès.",
            data:values
        });
    });
});

router.delete('/', (req, res) => {
    const id = req.query.id;
    var query = "DELETE FROM partners WHERE id= ?";
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send({
            code: 200,
            success: true,
            message: "partner removed with sucess"
        });
    })
})

router.put('/accept', (req, res) => {
    const id = req.query.id;
    var query = "update partners SET state = 1 where id = ?";
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send({
            code: 200,
            success: true,
            message: "partner accepted with sucess"
        });
    })
})

router.post('/add', (req, res) => {
    let body = req.body;
    let uid = null;
    const token = req.headers.authorization;
    var decoded = jwt.verify(token,process.env.ACCESS_TOKEN);
    if (decoded != null) {
            uid = decoded.id;
        }

    var query = "INSERT INTO `users_calandar`( `user_id`, `partner_id`, `date`, `heure`, `more`) VALUES  ?";
    var values = [
        [
            uid,
            body.partner_id,
            body.date,
            body.heure,
            body.more

        ]
    ];
    connection.query(query, [values], (err, result) => {
        if (err) throw err;
        res.send(
            {
                code: 200,
                success: true,
                message: "Service ajoutée avec succès a mon agenda."
            }
        );
    })
})

router.get('/agenda', (req, res) => {
    let uid = null;
    const token = req.headers.authorization;
    var decoded = jwt.verify(token,  process.env.ACCESS_TOKEN);
    if (decoded != null) {
        uid = decoded.id;
    }

    var query = "SELECT * FROM `users_calandar`,partners WHERE users_calandar.partner_id = partners.id AND  users_calandar.`user_id` = ?";

    connection.query(query, [uid], (err, result) => {
        if (err) throw err;
        const data = result
        res.send(
            {
                code: 200,
                success: true,
                data 
            }
        );
    })
})

router.delete('/agenda', (req, res) => {
  

    const id = req.query.id
    var query = "DELETE FROM `users_calandar` WHERE `id_prog` = ?";

    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(
            {
                code: 200,
                success: true,
                message: "Service deleted with success"
            }
        );
    })
})


module.exports = router;