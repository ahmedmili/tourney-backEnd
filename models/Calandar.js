
module.exports = (sequelize, DataTypes) => {
    const Calandar = sequelize.define("Calandar", {
        id_prog: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        partner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        heure: {
            type: DataTypes.STRING,
            allowNull: false
        },
        more: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    })
    Calandar.associate = (models) => {
        Calandar.belongsTo(models.Partners, { foreignKey: 'partner_id' });
    }
    return Calandar
}



