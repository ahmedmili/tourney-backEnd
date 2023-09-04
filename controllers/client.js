
// const connection = require('./../connection')
// const userService = require("../service/client")
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../service/mailer')

const db = require('../models')
const users = db.users

const loggin = async (req, res) => {
    data = req.body
    const user = await users.findOne({ whhere: { email: data.email } })
    // console.log("data",data)
    console.log("user", user)
    if (!user) res.status(203).json({
        success: false,
        status: 203,
        message: 'wrong email'
    });
    else if (user.password != data.password) res.status(203).json({
        success: false,
        status: 203,
        message: 'wrong password'
    })

    else {
        const tokenPayload = {
            email: user.email,
            fullname: user.fullname,
            id: user.id,
            lastName: user.lastName,
        }
        const ACCESS_TOKEN = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
        res.status(200).json(
            {
                token: ACCESS_TOKEN,
                message: "signed in succe",
                success: true,
                status: 200,
                user: tokenPayload,
            })
    }
}

const register = async (req, res) => {
    data = req.body
    try {
        const user = await users.findOne({ where: { email: data.email } })
        if (user) res.status(203).json({
            status: 203,
            success: false,
            message: "account allready exist"
        })
        else {
            users.create({
                email: data.email,
                fullname: data.fullname,
                lastName: data.lastName,
                password: data.password,
            });
            res.status(203).json({
                status: 200,
                success: true,
                message: "acount created with sucess"
            })
        }

    } catch (error) {
        console.log(error)
    }
    res.send("test")
}

const getList = async (req, res) => {
    try {
        const user = await users.findAll(
            {
                attributes: [
                    "id",
                    "email",
                    "fullname",
                    "lastName",
                    "createdAt",
                    "updatedAt",
                ],
            }
        )
        res.status(200).json({
            result: user,
            message: "sucess",
            code: 200,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

const hardDelete = async (req, res) => {
    try {
        id = req.query.id;
        users.destroy({ where: { id: id } }).then((rowsDeleted) => {
            res.status(200).json({
                success: true,
                message: "client removed with sucess",
                code: 200
            })
        }).catch((error) => {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "server error please contact admins",
                code: 500
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const forget_password = async (req, res) => {
    const body = req.body
    try {

        const user = await users.findOne({
            where: { email: body.email }
        })
        if (!user) res.status(404).json({
            success: false,
            message: "no account with this email",
            code: 404,
        })
        else {
            const secretKey = user.password + process.env.ACCESS_TOKEN
            const payload = {
                email: user.email,
                id: user.id
            }
            const token = jwt.sign(payload, secretKey, { expiresIn: '15m' })
            const link = `http://localhost:8080/api/v1/clients/reset_password/${user.id}/${token}`
            console.log(link)
            const mailInfo = {
                to: body.email,
                subject: "forget password",
                body: link,
            }
            sendEmail(mailInfo)
                .then(() => res.status(200).json({
                    message: 'check your email !!',
                    success: true,
                    code: 200,
                }))
                .catch((err) => {
                    console.log(err)
                    res.status(500).send('Error sending email.')
                });
        }
    } catch (error) {
        console.log(error)
    }
}
const reset_password = async (req, res) => {
    const { id, token } = req.params
    const user = await users.findOne({ where: { id: id } })
    if (!user) res.status(404).json({
        message: "user not found",
        success: false,
        code: 404,
    })
    else {
        const secretKey = user.password + process.env.ACCESS_TOKEN;
        try {
            const payload = jwt.verify(token, secretKey)
            if (payload) {
                res.render('reset-password', { email: user.email })
            } else res.status(203).json({
                success: false,
                code: 203,
                message: 'expired link'
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'server error',
                code: 500,
            })
        }
    }
}
const update_password = async (req, res) => {
    const { id, token } = req.params
    const { password, confirmPassword } = req.body
    const user = await users.findOne({ where: { id: id } })
    if (!user) res.status(404).json({
        message: "user not found",
        success: false,
        code: 404,
    })
    else {
        const secretKey = user.password + process.env.ACCESS_TOKEN;
        try {
            const payload = jwt.verify(token, secretKey)
            if (payload) {
                user.password = password;
                await user.save()
                res.send("password updated with success !!")
            } else res.status(203).json({
                success: false,
                code: 203,
                message: 'expired link'
            }).send('expired link')

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {
    forget_password,
    reset_password,
    update_password,
    register,
    loggin,
    getList,
    hardDelete,
}

