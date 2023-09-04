const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
    const users = sequelize.define("users", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
    return users;
}
