const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('carthapirates', 'carthapirates', 'carthapirates', { host: 'db', port: 5432, dialect: 'postgres' })

// MODEL

const Classe = sequelize.define('Classe', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false }
}, {
	timestamps: false,
	tableName: 'classes'
})

// QUERIES

async function getClasse (nom) {
	const classe = await Classe.findOne({ where: { nom } })
	return classe
}

// COMMANDS

async function creerClasse (nom) {
	// On vérifie qu'une classe ne porte pas déjà ce nom
	const classeExistante = await getClasse(nom)
	if (classeExistante) {
		return null
	} else {
		const sql = "INSERT INTO classes VALUES (DEFAULT, :nom);"
		const classe = await sequelize.query(sql, { replacements: { nom }, type: QueryTypes.INSERT }).then(() => { return getClasse(nom) })
		return classe
	}
}

async function deleteClasse (nom) {
	const deleted = await Classe.destroy({ where: { nom } })
	return deleted
}

// EXPORTS

module.exports = { getClasse, creerClasse, deleteClasse }
