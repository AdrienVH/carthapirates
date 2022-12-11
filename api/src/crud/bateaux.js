const { Sequelize, DataTypes, QueryTypes } = require('sequelize')
const { getTrajet } = require('./trajets')

// DATABASE

const sequelize = new Sequelize('carthapirates', 'carthapirates', 'carthapirates', {host: 'db', port: 5432, dialect: 'postgres' });

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
	let sql = "SELECT *, ST_Distance(St_Transform(ST_SetSRID(ST_Point(:lon, :lat), 4326), 3857), ST_Transform(geom, 3857)) AS distance FROM bateaux WHERE geom IS NOT NULL ORDER BY distance ASC LIMIT :limit"
	const bateaux = await sequelize.query(sql, {
		replacements: { lon, lat, limit },
		type: QueryTypes.SELECT
	})
	return bateaux
}

// COMMANDS

async function createBateau(idBateau, classe, nom) {
	let sql = "INSERT INTO bateaux VALUES (:idBateau, :nom, :classe, NULL);"
	const bateau = await sequelize.query(sql, { replacements: { idBateau, classe, nom }, type: QueryTypes.INSERT }).then(() => { return Bateau.findByPk(idBateau) })
	return bateau
}

async function putBateau(idBateau, lon, lat) {
	// On récupère le bateau
	const oldBateau = await Bateau.findByPk(idBateau)
	const oldXy = oldBateau.toJSON().geom ? oldBateau.toJSON().geom.coordinates : null
	// On déplace le bateau
	let sql = "UPDATE bateaux SET geom = ST_SetSRID(ST_MakePoint(:lon, :lat), 4326) WHERE id = :idBateau"
	const bateau = await sequelize.query(sql, { replacements: { idBateau, lon, lat }, type: QueryTypes.UPDATE }).then(() => {return Bateau.findByPk(idBateau)})
	// On trace le trajet
	const trajetGeom = oldXy ? `(${buildRoutingQuery(oldXy, [lon, lat])})` : 'NULL'
	const trajetSql = `INSERT INTO trajets VALUES (DEFAULT, ${idBateau}, CURRENT_TIMESTAMP, ${trajetGeom}, FALSE) RETURNING id`
	const trajet = await sequelize.query(trajetSql, { type: QueryTypes.INSERT }).then((r) => { return getTrajet(r[0][0].id) })
	// On retourne le bateau et le trajet
	return { bateau, trajet }
}

function buildRoutingQuery(oldXY, newXY) {
	const nearestNodeFromOldXY = `SELECT id FROM routes_vertices_pgr ORDER BY ST_Distance(ST_SetSRID(ST_MakePoint(${oldXY.join(', ')}), 4326), the_geom) ASC LIMIT 1`
	const nearestNodeFromNewXY = `SELECT id FROM routes_vertices_pgr ORDER BY ST_Distance(ST_SetSRID(ST_MakePoint(${newXY.join(', ')}), 4326), the_geom) ASC LIMIT 1`
	const query = `
	SELECT ST_ChaikinSmoothing(ST_LineMerge(ST_Union(wkb_geometry)), 5, true)
	FROM pgr_dijkstra('SELECT ogc_fid AS id, source, target, distance / 1852 AS cost FROM routes', (${nearestNodeFromOldXY}), (${nearestNodeFromNewXY}), FALSE) AS pgr
	LEFT JOIN routes AS r ON pgr.edge = r.ogc_fid
	`
	return query
}

async function rentrerBateau(idBateau) {
	let sql = "UPDATE bateaux SET geom = NULL WHERE id = :idBateau"
	const bateau = await sequelize.query(sql, { replacements: { idBateau }, type: QueryTypes.UPDATE })
	.then(() => {return Bateau.findByPk(idBateau)})
	return bateau
}

async function deleteBateau(id) {
	const deleted = await Bateau.destroy({ where: { id } })
	return deleted
}

// EXPORTS

module.exports = { getBateaux, getBateau, createBateau, getBateauxByLonLat, putBateau, rentrerBateau, deleteBateau }
