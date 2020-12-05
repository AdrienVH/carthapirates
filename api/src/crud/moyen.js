const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('myfirstdb', 'myfirstuser', 'myfirstpwd', {host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Moyen = sequelize.define('Moyen', {
	id: { type: DataTypes.INTEGER, allowNull:false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false },
	geom: { type: DataTypes.GEOMETRY },
	coordonnees: { type: DataTypes.ARRAY(DataTypes.FLOAT) }
}, {
	timestamps: false,
	tableName: 'moyen'
});

// QUERIES

async function getMoyens () {
	const moyens = await Moyen.findAll()
	//const moyens = await Moyen.findAll({ where: { xxx: xxx } })
	return moyens.map(function(moyen){ return moyen.toJSON() })
}

async function getMoyen (id) {
	const moyen = await Moyen.findByPk(id)
	return moyen.toJSON()
}

async function getMoyensByLonLat (lon, lat, limit) {
	let sql = "SELECT *, ST_Distance(St_Transform(ST_SetSRID(ST_Point(:lon, :lat), 4326), 3857), ST_Transform(geom, 3857)) AS distance FROM moyen ORDER BY distance ASC LIMIT :limit"
	const moyens = await sequelize.query(sql, {
		replacements: { lon, lat, limit },
		type: QueryTypes.SELECT
	})
	return moyens
}

// COMMANDS

async function putMoyen(id, lon, lat) {
	let sql = "UPDATE moyen SET geom = ST_SetSRID(ST_MakePoint(:lon,:lat),4326), coordonnees = array_cat(ARRAY[:lon,:lat]::float[][], coordonnees[1:2]) WHERE id = :id"
	const moyen = await sequelize.query(sql, {
		replacements: { id, lon: parseFloat(lon), lat: parseFloat(lat) },
		type: QueryTypes.UPDATE
	})
	.then(() => {return Moyen.findByPk(id)})
	return moyen.toJSON()
}

async function deleteMoyen(id) {
	const deleted = await Moyen.destroy({ where: { id } })
	return deleted
}

// EXPORTS

module.exports = { getMoyens, getMoyen, getMoyensByLonLat, putMoyen, deleteMoyen }
