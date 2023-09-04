

// const { Sequelize, DataTypes } = require('sequelize');
// const Partner = require('./Partners')
module.exports = (sequelize, DataTypes) => {
    const Region = sequelize.define("Region", {
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },  
    })
        // Region.hasMany(Partner, { foreignKey: 'region_id' });
    return Region
}





