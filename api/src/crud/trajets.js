const { Sequelize, DataTypes, QueryTypes, Op } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('carthapirates', 'carthapirates', 'carthapirates', { host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Trajet = sequelize.define('Trajet', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	idBateau: { type: DataTypes.INTEGER, allowNull: false, field: 'id_bateau' },
	date: { type: DataTypes.DATE },
	geom: { type: DataTypes.GEOMETRY },
	deleted: { type: DataTypes.BOOLEAN }
}, {
	timestamps: false,
	tableName: 'trajets'
});

// QUERIES

async function getTrajets () {
	// FIX ME #18 : ROW_NUMBER devrait retourner un integer et non une string
	const sql = `
	SELECT id, id_bateau, date, geom, ROW_NUMBER () OVER (PARTITION BY id_bateau ORDER BY id ASC) AS ordre
	FROM trajets
	WHERE geom IS NOT NULL AND deleted = false;
	`
	const trajets = await sequelize.query(sql, { type: QueryTypes.SELECT })
	return trajets
}

async function getTrajetsBateau (idBateau) {
	// FIX ME #18 : ROW_NUMBER devrait retourner un integer et non une string
	const sql = `
	SELECT id, id_bateau, date, geom, ROW_NUMBER () OVER (PARTITION BY id_bateau ORDER BY id ASC) AS ordre
	FROM trajets
	WHERE id_bateau = :idBateau AND geom IS NOT NULL AND deleted = false;
	`
	const trajets = await sequelize.query(sql, { replacements: { idBateau }, type: QueryTypes.SELECT })
	return trajets
}

async function getTrajet (id) {
	const trajet = await Trajet.findByPk(id)
	return trajet
}

// COMMANDS

async function deleteTrajets (idBateau) {
	const deleted = await Trajet.update({ deleted: true }, { where: { idBateau } })
	return deleted
}

// EXPORTS

module.exports = { getTrajets, getTrajetsBateau, getTrajet, deleteTrajets }
