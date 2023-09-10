
const schedule = require('node-schedule');
const db = require('../../models');
const { sendEmail } = require('../mailer');

const users = db.users
const Calandar = db.Calandar;

const mailingJob = () => {
    const job = schedule.scheduleJob('*/10 * * * * *', async function () {
        const programms = await Calandar.findAll()

        programms.map(async (program) => {
            let progDate = program.date
            let progTime = program.heure
            const currentDate = new Date();
            const timeDifference = progDate - currentDate;
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            if (0 < hoursDifference && hoursDifference <= 1) {
                let userId = program.user_id
                const user = await users.findOne({ where: { id: userId } })
                console.log("userId", user.email)
                const data = {
                    to: user.email,
                    subject: "programm reminder",
                    body: "The given date and time is less than 1 hour away from the current time.",
                }
                sendEmail(data)
            } else if (hoursDifference < 0) {
                let userId = program.user_id
                const user = await users.findOne({ where: { id: userId } })
                console.log("userId", user.email)
                const data = {
                    to: user.email,
                    subject: "programm warning",
                    body: "programm date passed in " + Math.abs(Math.ceil(hoursDifference)) + "ago",
                }
                sendEmail(data)
                program.destroy()
            } else {
                console.log("The given date and time is more than 1 hour away from the current time.");
            }
        })
    });
}


module.exports = {
    mailingJob,
}
//   *    *    *    *    *    *
//   ┬    ┬    ┬    ┬    ┬    ┬
//   │    │    │    │    │    │
//   │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
//   │    │    │    │    └───── month (1 - 12)
//   │    │    │    └────────── day of month (1 - 31)
//   │    │    └─────────────── hour (0 - 23)
//   │    └──────────────────── minute (0 - 59)
//   └───────────────────────── second (0 - 59, OPTIONAL)


