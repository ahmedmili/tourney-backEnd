

const jwt = require('jsonwebtoken');

const db = require('../models')
const users = db.Partners
const Region = db.Region
const { Op } = require('sequelize');


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
                attributes: { exclude: ['password'] },
                where: { state: 1 }
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
const demandeList = async (req, res) => {
    try {
        const user = await users.findAll(
            {
                attributes: { exclude: ['password'] },
                where: { state: 0 }
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

const searchForPartner = async (req, res) => {
    const params = req.query;
    const region = params.region;
    const keywords = params.keywords;
    console.log("keywords", keywords)
    console.log("region", region)
    try {
        const Region = db.Region
        users.findAll({
            where: {
                state: 1,
                region_id: region,
                name: {
                    [Op.like]: `%${keywords}%`,
                },
            },
            include: [Region], // Include the Region model to join the tables
        }).then((data) => {
            res.status(200).json({
                success: true,
                message: 'search success',
                result: data,
            })
        }).catch((error) => {
            console.log(error)
            res.status(404).json({
                success: false,
                message: 'not fount',
                result: [],
            })
        })
    } catch (error) {
        console.log(error)
    }
}
const searchForPartnerById = async (req, res) => {
    const params = req.query;
    const id = params.id;

    try {
        users.findAll({
            where: {
                id: id,
            },
        }).then((data) => {
            console.log(data)
            res.status(200).json({
                success: true,
                message: 'search success',
                result: data,
            })
        }).catch((error) => {
            console.log(error)
            res.status(404).json({
                success: false,
                message: 'not fount',
                result: [],
            })
        })
    } catch (error) {
        console.log(error)
    }
}
const create = async (req, res) => {
    let body = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
    }

    try {
        const imagePath = req.file.path;


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
        users.create({ values }).then((data) => {

            res.status(200).json({
                code: 200,
                success: true,
                message: 'Partenaire ajouté avec succès.',
                data: data,
            })
        }).catch((error) => {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'server error',
                data: [],
            })
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
                message: "Partner removed with sucess",
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

const hardDeleteAgenda = async (req, res) => {
    const Calandar = db.Calandar
    try {
        id = req.query.id;
        Calandar.destroy({ where: { id_prog: id } }).then((rowsDeleted) => {
            res.status(200).json({
                success: true,
                message: "Programm removed with sucess",
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
        res.status(500).json({
            success: false,
            message: "server error please contact admins",
            code: 500
        })
    }
}

const accept = async (req, res) => {
    try {
        id = req.query.id;
        const user = await users.findOne({ where: { id: id } })
        if (!user) res.status(404).json({
            success: false,
            code: 404,
            message: "not found"
        })
        user.state = 1;
        await user.save()
        res.status(200).json({
            success: true,
            code: 200,
            message: "update with success"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            code: 500,
            message: "Internal server error"
        });
    }
}
const add = async (req, res) => {
    let body = req.body;
    let uid = null;
    const token = req.headers.authorization;
    try {
        var decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        if (decoded != null) {
            uid = decoded.id;
        }
    } catch (e) {
        res.status(203).json({
            status: 203,
            success: false,
            message: "unauthorized",
            data: {}
        })
    }
    var values =
    {
        user_id: uid,
        partner_id: body.partner_id,
        date: body.date,
        heure: body.heure,
        more: body.more
    }
    try {
        const Calandar = db.Calandar
        Calandar.create(values).then((data) => {
            res.status(200).json({
                code: 200,
                success: true,
                message: 'Programme ajouté avec succès.',
                data: data,
            })
        }).catch((error) => {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'server error',
                data: [],
            })
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            code: 500,
            message: "Internal server error"
        });
    }
}
const getAgenda = async (req, res) => {
    let uid = null;
    const token = req.headers.authorization;
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    if (decoded != null) {
        uid = decoded.id;
    }

    try {
        const Calandar = db.Calandar
        Calandar.findAll({
            where: { user_id: uid },
            include: [users ], // Include the Partner model to join the tables
        })
            .then((results) => {
                // Process the query results (results will include both UsersCalendar and Partner data)
                console.log(results);
                res.status(200).json(
                    {
                        code: 200,
                        success: true,
                        data: results,
                    }
                );
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json(
                    {
                        code: 500,
                        success: false,
                        error: error,
                    }
                );
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            code: 500,
            message: "Internal server error",
            error: error
        });
    }
}



module.exports = {
    // register,
    // loggin,
    create,
    getList,
    demandeList,
    searchForPartnerById,
    searchForPartner,
    hardDelete,
    hardDeleteAgenda,
    accept,
    add,
    getAgenda,
}

