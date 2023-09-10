require('dotenv').config();
const http = require('http');
const app = require('./index')
const server = http.createServer(app)

const db = require("./models");
const { mailingJob } = require('./service/jobs/scheduler');




// mailingJob()
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronization done!');
        server.listen(process.env.PORT, () => {
            console.log("server connected on port")
        })
    })
    .catch(err => {
        console.error('An error occurred during database synchronization:', err);
    });
