const express = require('express');
var cors = require('cors');
// const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
// const connection = require('./config2/connection')
const clientRoute = require("./routes/clients")
const partnersRoute = require("./routes/partners")
const regionsRoute = require("./routes/regions")
// const mailingRoute = require("./service/mailer")

const app = express();
// const multer = require('multer');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.set("view engine",'ejs')

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/clients', clientRoute)
app.use('/api/v1/partners', partnersRoute)
app.use('/api/v1/regions', regionsRoute)
// app.use('/api/v1/mail', mailingRoute)


module.exports = app;