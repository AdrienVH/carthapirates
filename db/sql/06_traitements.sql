-- Création des champs source et target

ALTER TABLE "routes" ADD COLUMN "source" integer;

ALTER TABLE "routes" ADD COLUMN "target" integer;

-- Mettre une tolérance à 0 posait problème (présence de vertices en double)

SELECT pgr_createTopology('routes', 0.0001, 'wkb_geometry', 'ogc_fid');

-- Calculer le node le plus proche de chaque port

WITH nodes AS (
    SELECT p.id AS port_id, v.id AS node_id
    FROM ports AS p
    CROSS JOIN LATERAL (SELECT v.id, v.the_geom <-> p.geom AS dist FROM routes_vertices_pgr AS v ORDER BY dist LIMIT 1) v
)
UPDATE ports SET nearest_node = nodes.node_id FROM nodes WHERE nodes.port_id = ports.id;

-- Versions utilisées

SELECT 'postgis' AS extension, postgis_version() AS version
UNION
SELECT 'pgrouting' AS extension, pgr_version() AS version;