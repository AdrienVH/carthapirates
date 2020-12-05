const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('myfirstdb', 'myfirstuser', 'myfirstpwd', {host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Port = sequelize.define('Port', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false },
	geom: { type: DataTypes.GEOMETRY },
}, {
	timestamps: false,
	tableName: 'ports'
});

// QUERIES

async function getPorts () {
	const ports = await Port.findAll()
	return ports.map(function(port){ return port.toJSON() })
}

async function getPort (id) {
	const port = await Port.findByPk(id)
	return port.toJSON()
}

async function getPortsByLonLat (lon, lat, limit) {
	let sql = "SELECT *, ST_Distance(St_Transform(ST_SetSRID(ST_Point(:lon, :lat), 4326), 3857), ST_Transform(geom, 3857)) AS distance FROM ports ORDER BY distance ASC LIMIT :limit"
	const ports = await sequelize.query(sql, {
		replacements: { lon, lat, limit },
		type: QueryTypes.SELECT
	})
	return ports
}

// COMMANDS

async function createPort(id, nom, lon, lat) {
	let sql = "INSERT INTO ports VALUES (:id, :nom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326));"
	const ports = await sequelize.query(sql, {
		replacements: { id, nom, lon, lat },
		type: QueryTypes.INSERT
	})
	return ports
}

// EXPORTS

module.exports = { getPorts, getPort, createPort, getPortsByLonLat }
