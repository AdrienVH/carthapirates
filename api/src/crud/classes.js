const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('carthapirates', 'carthapirates', 'carthapirates', { host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Classe = sequelize.define('Classe', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false }
}, {
	timestamps: false,
	tableName: 'classes'
});

// QUERIES

async function getClasses () {
	const classes = await Classe.findAll()
	return classes
}

async function getClasse (nom) {
	const classe = await Classe.findOne({ where: { nom } })
	return classe
}

// COMMANDS

async function createClasse(nom) {
	const sql = "INSERT INTO classes VALUES (DEFAULT, :nom);"
	const classe = await sequelize.query(sql, { replacements: { nom }, type: QueryTypes.INSERT }).then(() => { return Classe.findOne({ where: { nom } }) })
	return classe
}

async function deleteClasse(nom) {
	const deleted = await Classe.destroy({ where: { nom } })
	return deleted
}

// EXPORTS

module.exports = { getClasses, getClasse, createClasse, deleteClasse }
