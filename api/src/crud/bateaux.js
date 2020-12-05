const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('myfirstdb', 'myfirstuser', 'myfirstpwd', {host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Bateau = sequelize.define('Bateau', {
	id: { type: DataTypes.INTEGER, allowNull:false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false },
	geom: { type: DataTypes.GEOMETRY },
	coordonnees: { type: DataTypes.ARRAY(DataTypes.FLOAT) }
}, {
	timestamps: false,
	tableName: 'bateaux'
});

// QUERIES

async function getBateaux () {
	const bateaux = await Bateau.findAll()
	return bateaux.map(function(bateau){ return bateau.toJSON() })
}

async function getBateau (id) {
	const bateau = await Bateau.findByPk(id)
	return bateau.toJSON()
}

async function getBateauxByLonLat (lon, lat, limit) {
	let sql = "SELECT *, ST_Distance(St_Transform(ST_SetSRID(ST_Point(:lon, :lat), 4326), 3857), ST_Transform(geom, 3857)) AS distance FROM bateaux ORDER BY distance ASC LIMIT :limit"
	const bateaux = await sequelize.query(sql, {
		replacements: { lon, lat, limit },
		type: QueryTypes.SELECT
	})
	return bateaux
}

// COMMANDS

async function putBateau(id, lon, lat) {
	let sql = "UPDATE bateaux SET geom = ST_SetSRID(ST_MakePoint(:lon,:lat),4326), coordonnees = array_cat(ARRAY[:lon,:lat]::float[][], coordonnees[1:2]) WHERE id = :id"
	const bateau = await sequelize.query(sql, {
		replacements: { id, lon: parseFloat(lon), lat: parseFloat(lat) },
		type: QueryTypes.UPDATE
	})
	.then(() => {return Bateau.findByPk(id)})
	return bateau.toJSON()
}

async function deleteBateau(id) {
	const deleted = await Bateau.destroy({ where: { id } })
	return deleted
}

// EXPORTS

module.exports = { getBateaux, getBateau, getBateauxByLonLat, putBateau, deleteBateau }
