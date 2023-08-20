const express = require('express');
var cors = require('cors');
const connection = require('./connection')
const clientRoute = require("./routes/clients")
const partnersRoute = require("./routes/partners")
const regionsRoute = require("./routes/regions")

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use('/api/v1/clients',clientRoute)
app.use('/api/v1/partners',partnersRoute)
app.use('/api/v1/regions',regionsRoute)
module.exports = app;