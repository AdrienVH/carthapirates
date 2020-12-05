const { Sequelize, DataTypes, QueryTypes } = require('sequelize')

// DATABASE

const sequelize = new Sequelize('myfirstdb', 'myfirstuser', 'myfirstpwd', {host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Site = sequelize.define('Site', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false },
	geom: { type: DataTypes.GEOMETRY },
}, {
	timestamps: false,
	tableName: 'site'
});

// QUERIES

async function getSites () {
	const sites = await Site.findAll()
	return sites.map(function(site){ return site.toJSON() })
}

async function getSite (id) {
	const site = await Site.findByPk(id)
	return site.toJSON()
}

async function getSitesByLonLat (lon, lat, limit) {
	let sql = "SELECT *, ST_Distance(St_Transform(ST_SetSRID(ST_Point(:lon, :lat), 4326), 3857), ST_Transform(geom, 3857)) AS distance FROM site ORDER BY distance ASC LIMIT :limit"
	const sites = await sequelize.query(sql, {
		replacements: { lon, lat, limit },
		type: QueryTypes.SELECT
	})
	return sites
}

// EXPORTS

module.exports = { getSites, getSite, getSitesByLonLat }
