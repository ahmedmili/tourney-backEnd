
// const { DataTypes } = require('sequelize');
// const Region = require("../models/Regions")
module.exports = (sequelize, DataTypes) => {
    const Partner = sequelize.define("Partners", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logo_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                is: /^\d{8}$/ // Validate that the phone number has 10 digits (adjust the pattern as needed)
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true
        },
        about: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.JSON,
            allowNull: true
        },
        region_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        state: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
    Partner.associate = (models) => {
        Partner.belongsTo(models.Region, { foreignKey: 'region_id' });
        Partner.hasMany(models.Calandar, { foreignKey: 'partner_id' });
    }
    return Partner
}



