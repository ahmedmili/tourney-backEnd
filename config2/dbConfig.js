module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PORT: process.env.DB_PORT,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_PASSWORD,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
