const { Sequelize, DataTypes, Op } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('myfirstdb', 'myfirstuser', 'myfirstpwd', {host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Trajet = sequelize.define('Trajet', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	idBateau: { type: DataTypes.INTEGER, allowNull: false, field: 'id_bateau' },
	date: { type: DataTypes.DATE },
	geom: { type: DataTypes.GEOMETRY }
}, {
	timestamps: false,
	tableName: 'trajets'
});

// QUERIES

async function getTrajets () {
	const trajets = await Trajet.findAll({ where: { geom: { [Op.ne]: null } } })
	return trajets.map(function(trajet){ return trajet.toJSON() })
}

async function getTrajet (id) {
	const trajet = await Trajet.findByPk(id)
	return trajet.toJSON()
}

// COMMANDS

async function deleteTrajets(idBateau) {
	const deleted = await Trajet.destroy({ where: { idBateau } })
	return deleted
}

// EXPORTS

module.exports = { getTrajets, getTrajet, deleteTrajets }
