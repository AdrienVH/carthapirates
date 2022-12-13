DROP TABLE IF EXISTS ports;
CREATE TABLE ports (
    id integer CONSTRAINT pkey_ports_id PRIMARY KEY,
    nom text,
    geom geometry(POINT, 4326),
    nearest_node integer
);

INSERT INTO ports VALUES (1, 'Marseille',           ST_SetSRID(ST_MakePoint(05.35668, 43.29763), 4326));
INSERT INTO ports VALUES (2, 'Alger',               ST_SetSRID(ST_MakePoint(03.06964, 36.77887), 4326));
INSERT INTO ports VALUES (3, 'Naples',              ST_SetSRID(ST_MakePoint(14.16007, 40.80333), 4326));
INSERT INTO ports VALUES (4, 'Palermo',             ST_SetSRID(ST_MakePoint(13.36984, 38.13083), 4326));
INSERT INTO ports VALUES (5, 'Melilla',             ST_SetSRID(ST_MakePoint(-2.92285, 35.28000), 4326));
INSERT INTO ports VALUES (6, 'Fiumicino',           ST_SetSRID(ST_MakePoint(12.23545, 41.75583), 4326));
INSERT INTO ports VALUES (7, 'Ibiza',               ST_SetSRID(ST_MakePoint(01.45000, 38.90000), 4326));
INSERT INTO ports VALUES (8, 'Tunis',               ST_SetSRID(ST_MakePoint(10.25000, 36.80000), 4326));
INSERT INTO ports VALUES (9, 'Bejaia',              ST_SetSRID(ST_MakePoint(05.08000, 36.75000), 4326));
INSERT INTO ports VALUES (10, 'Oran',               ST_SetSRID(ST_MakePoint(-0.63669, 35.7125), 4326));
INSERT INTO ports VALUES (11, 'Almeria',            ST_SetSRID(ST_MakePoint(-2.47126, 36.83222222), 4326));
INSERT INTO ports VALUES (12, 'Cagliari',           ST_SetSRID(ST_MakePoint(09.10759, 39.20416667), 4326));
INSERT INTO ports VALUES (13, 'Alicante',           ST_SetSRID(ST_MakePoint(-0.48828033, 38.33527778), 4326));
INSERT INTO ports VALUES (14, 'Valencia',           ST_SetSRID(ST_MakePoint(-0.318433451, 39.44416667), 4326));
INSERT INTO ports VALUES (15, 'Ajaccio',            ST_SetSRID(ST_MakePoint(08.738810365, 41.92), 4326));
INSERT INTO ports VALUES (16, 'Bastia',             ST_SetSRID(ST_MakePoint(09.451943463, 42.7), 4326));
INSERT INTO ports VALUES (17, 'Nice',               ST_SetSRID(ST_MakePoint(07.285630153, 43.69388889), 4326));
INSERT INTO ports VALUES (18, 'Livorno',            ST_SetSRID(ST_MakePoint(10.30194346, 43.55583333), 4326));
INSERT INTO ports VALUES (19, 'Barcelona',          ST_SetSRID(ST_MakePoint(02.168786808, 41.35472222), 4326));
INSERT INTO ports VALUES (20, 'Palma de Mallorca',  ST_SetSRID(ST_MakePoint(02.62532391, 39.55111111), 4326));