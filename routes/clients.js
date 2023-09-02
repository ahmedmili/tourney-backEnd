const express = require('express');
const connection = require('./../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config()

router.post('/signup', (req, res) => {
    var user = req.body;

    query = "select * from users where email =?"
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            // console.log(result.length)
            if (result.length <= 0) {
                query = "INSERT INTO users (email,fullname, lastName, password) VALUES ?";
                var values = [
                    [user.email, user.fullname, user.lastName, user.password]
                ];
                console.log(values)
                console.log(user)
                connection.query(query, [values], (errr, resultt) => {
                    if (!errr) {
                        // console.log('sucess')
                        return res.status(200).json({ message: "sucessfully Registred" })
                    }
                    else {
                        console.log(errr)
                        return res.status(500).json({ message: "errr" })
                        // throw errr
                    }
                })
            } else {
                console.log("email existe")
                return res.status(203).send({ message: "email already existe" })
            }
        }
        else {
            console.log("err contact dev team")
            return res.status(400).json({ message: err })
        }
    })
})


router.post('/login', (req, res) => {
    var user = req.body;
    query = "select * from users where email =?"
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if ((result.length <= 0) || (result[0].password != user.password)) {
                console.log("Incorrect Username or Password")
                return res.status(401).json(
                    {
                        message: "Incorrect Username or Password",
                    })
            } else if (result[0].status === 'false') {
                console.log("wait for admin Approval")
                return res.status(401).json({ message: "wait for admin Approval" })
            } else if (result[0].password == user.password) {
                const user = {
                    email:result[0].email,
                    fullname:result[0].fullname,
                    id:result[0].id,
                    lastName:result[0].lastName,
                }
                const ACCESS_TOKEN = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json(
                    {
                         token: ACCESS_TOKEN,
                          message: "signed in succe",
                        success : true,
                        user
                        })
            } else {
                console.log("somethins went wrong. Please try again later")
                return res.status(400).json({ message: "somethins went wrong. Please try again later" });
            }
        }
    })
})

router.get('/getList', (req, res) => {
    query = "SELECT * from users"
    connection.query(query, (err, result) => {
        if (!err) {
            res.status(200).json({
                result : result,
                message : "sucess",
                code:200,
                success:true
            })
        } else {
            console.log(err)
        }
    })
})


router.get('/decodeToken', (req, res) => {
    var token = req.headers.authorization;
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    console.log(decoded)
    res.send({ success: true, user: decoded.user });

})
router.delete('/', (req, res) => {
    id = req.query.id;
    console.log(req)
    query = "DELETE FROM users WHERE id= ?"
    connection.query(query, id, (err, result) => {
        if (!err) {
            res.status(200).json({
                success:true,
                message: "client removed with sucess",
                code:200
            })
        } else {
            console.log(err)
        }
    })

})
module.exports = router;