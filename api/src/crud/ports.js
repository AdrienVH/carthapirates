import { Sequelize, DataTypes, QueryTypes } from 'sequelize'

// DATABASE

const sequelize = new Sequelize('carthapirates', 'carthapirates', 'carthapirates', { host: 'db', port: 5432, dialect: 'postgres' })

// MODEL

const Port = sequelize.define('Port', {
	id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
	nom: { type: DataTypes.STRING, allowNull: false },
	nearestNode: { type: DataTypes.INTEGER, allowNull: false, field: 'nearest_node' },
	geom: { type: DataTypes.GEOMETRY },
}, {
	timestamps: false,
	tableName: 'ports'
})

// QUERIES

async function getPorts () {
	const ports = await Port.findAll()
	return ports.map(function(port){ return port.toJSON() })
}

async function getPort (id) {
	const port = await Port.findByPk(id)
	return port.toJSON()
}

async function getPortsByLonLat(lon, lat, limit) {
	let routingQuery = buildRoutingQuery(lon, lat)
	let sql = `
	WITH routes AS (${routingQuery})
	SELECT ports.id, ports.nom, ports.geom, ROUND(routes.distance::numeric, 2) AS distance
	FROM routes
	LEFT JOIN ports ON routes.port_node = ports.nearest_node
	ORDER BY routes.distance ASC
	LIMIT :limit;
	`
	const ports = await sequelize.query(sql, { replacements: { limit }, type: QueryTypes.SELECT })
	return ports
}

function buildRoutingQuery(lon, lat) {
	const nearestNodeFromXY = `SELECT id FROM routes_vertices_pgr ORDER BY ST_Distance(ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), the_geom) ASC LIMIT 1`
	const nodesFromPorts = `SELECT array_agg(nearest_node) FROM ports`
	const query = `
	SELECT end_vid AS port_node, MAX(agg_cost) AS distance
	FROM pgr_dijkstra(
		'SELECT ogc_fid AS id, source, target, distance / 1852 AS cost FROM routes',
		(${nearestNodeFromXY}),
		(${nodesFromPorts}),
		FALSE
	)
	GROUP BY end_vid
	`
	return query
}

// COMMANDS

async function createPort(id, nom, lon, lat) {
	let sql = "INSERT INTO ports VALUES (:id, :nom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326));"
	const port = await sequelize.query(sql, {
		replacements: { id, nom, lon, lat },
		type: QueryTypes.INSERT
	})
	.then(() => {return Port.findByPk(id)})
	return port
}

async function deletePort(id) {
	const deleted = await Port.destroy({ where: { id } })
	return deleted
}

// EXPORTS

export default { getPorts, getPort, createPort, getPortsByLonLat, deletePort }
