
const express = require('express');
const connection = require('../config2/connection')
const router = express.Router();

router.post('/', (req, res) => {
  const body =  req.body;
  var query = "INSERT INTO `partners`( `label`) VALUES  ?";
  connection.query(query, [body.label], (err, result) => {
        if (err) throw err;
        res.send(
            {
                code: 200,
                success: true,
            }

        );
    })
})

router.get('/', (req, res) => {
    query = "SELECT * from regions"
    connection.query(query, [], (err, result) => {
        if (err) throw err;
        res.send(
            {
                code: 200,
                success: true,
                data: result
            }
        );
    })
})

router.delete('/', (req, res) => {
    const id = req.query.id
    query =  "DELETE FROM regions WHERE id= ?"
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.send(
            {
                code: 200,
                success: true,
            }

        );
    })
})


module.exports = router;