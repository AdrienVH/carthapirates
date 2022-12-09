const { Sequelize, DataTypes, QueryTypes } = require('sequelize')
const { getTrajet } = require('./trajets')

// DATABASE

const sequelize = new Sequelize('myfirstdb', 'myfirstuser', 'myfirstpwd', {host: 'db', port: 5432, dialect: 'postgres' });

// MODEL

const Bateau = sequelize.define('Bateau', {
	id: { type: DataTypes.INTEGER, allowNull:false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false },
	geom: { type: DataTypes.GEOMETRY }
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

async function createBateau(id, nom, lon, lat) {
	let sql = "INSERT INTO bateaux VALUES (:id, :nom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), ARRAY[[:lon, :lat]]);"
	const bateau = await sequelize.query(sql, {
		replacements: { id, nom, lon: parseFloat(lon), lat: parseFloat(lat) },
		type: QueryTypes.INSERT
	})
	.then(() => {return Bateau.findByPk(id)})
	return bateau.toJSON()
}

async function putBateau(idBateau, lon, lat) {
	// On récupère le bateau
	let bateau = await Bateau.findByPk(idBateau)
	const oldXy = bateau.toJSON().geom ? bateau.toJSON().geom.coordinates : null
	// On déplace le bateau
	let sql = "UPDATE bateaux SET geom = ST_SetSRID(ST_MakePoint(:lon,:lat),4326) WHERE id = :idBateau"
	bateau = await sequelize.query(sql, { replacements: { idBateau, lon: parseFloat(lon), lat: parseFloat(lat) }, type: QueryTypes.UPDATE })
	.then(() => {return Bateau.findByPk(idBateau)})
	// On trace le trajet
	let trajetGeom = 'NULL'
	if (oldXy) {
		trajetGeom = `(${buildRoutingQuery(oldXy, [lon, lat])})`
	}
	let trajetSql = `INSERT INTO trajets VALUES (DEFAULT, ${idBateau}, CURRENT_TIMESTAMP, ${trajetGeom}, FALSE) RETURNING id`
	const returning = await sequelize.query(trajetSql, { type: QueryTypes.INSERT })
	const idTrajet = returning[0][0].id
	const trajet = await getTrajet(idTrajet)
	// On retourne le bateau et le trajet
	return { bateau: bateau.toJSON(), trajet: trajet }
}

async function rentrerBateau(idBateau) {
	let sql = "UPDATE bateaux SET geom = NULL WHERE id = :idBateau"
	const bateau = await sequelize.query(sql, { replacements: { idBateau }, type: QueryTypes.UPDATE })
	.then(() => {return Bateau.findByPk(idBateau)})
	return bateau
}

function buildRoutingQuery(oldXY, newXY) {
	const nearestNodeFromOldXY = `SELECT id FROM postgis_01_routes_vertices_pgr ORDER BY ST_Distance(ST_SetSRID(ST_MakePoint(${oldXY.join(', ')}), 4326), the_geom) ASC LIMIT 1`
	const nearestNodeFromNewXY = `SELECT id FROM postgis_01_routes_vertices_pgr ORDER BY ST_Distance(ST_SetSRID(ST_MakePoint(${newXY.join(', ')}), 4326), the_geom) ASC LIMIT 1`
	const query = `
	SELECT ST_ChaikinSmoothing(ST_LineMerge(ST_Union(wkb_geometry)), 5, true)
	FROM pgr_dijkstra('SELECT ogc_fid AS id, source, target, distance / 1852 AS cost FROM postgis_01_routes', (${nearestNodeFromOldXY}), (${nearestNodeFromNewXY}), FALSE) AS pgr
	LEFT JOIN postgis_01_routes AS r ON pgr.edge = r.ogc_fid
	`
	return query
}

async function deleteBateau(id) {
	const deleted = await Bateau.destroy({ where: { id } })
	return deleted
}

// EXPORTS

module.exports = { getBateaux, getBateau, createBateau, getBateauxByLonLat, putBateau, rentrerBateau, deleteBateau }
