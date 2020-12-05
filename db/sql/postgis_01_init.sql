CREATE EXTENSION postgis;

DROP TABLE IF EXISTS bateaux;
CREATE TABLE bateaux (id integer CONSTRAINT pkey_bateaux_id PRIMARY KEY, nom text, geom geometry(POINT, 4326), coordonnees float[][]);

INSERT INTO bateaux VALUES (1, 'Les Croustillants', ST_SetSRID(ST_MakePoint(6.0, 40.0), 4326), ARRAY[[6.0, 40.0]]);
INSERT INTO bateaux VALUES (2, 'Les Shadoks', ST_SetSRID(ST_MakePoint(6.2, 40.2), 4326), ARRAY[[6.2, 40.2]]);
INSERT INTO bateaux VALUES (3, 'Chocolatine ❤', ST_SetSRID(ST_MakePoint(6.4, 40.4), 4326), ARRAY[[6.4, 40.4]]);
INSERT INTO bateaux VALUES (4, 'The Amazon Leaders', ST_SetSRID(ST_MakePoint(6.6, 40.6), 4326), ARRAY[[6.6, 40.6]]);
INSERT INTO bateaux VALUES (5, 'LVMH ◆', ST_SetSRID(ST_MakePoint(6.8, 40.8), 4326), ARRAY[[6.8, 40.8]]);
INSERT INTO bateaux VALUES (6, 'The Cosmo Girls', ST_SetSRID(ST_MakePoint(7.0, 41.0), 4326), ARRAY[[7.0, 41.0]]);

DROP TABLE IF EXISTS ports;
CREATE TABLE ports (id integer CONSTRAINT pkey_ports_id PRIMARY KEY, nom text, geom geometry(POINT, 4326));

INSERT INTO ports VALUES (1, 'Marseille', ST_SetSRID(ST_MakePoint(5.35668, 43.29763), 4326));
INSERT INTO ports VALUES (2, 'Alger', ST_SetSRID(ST_MakePoint(3.06964, 36.77887), 4326));
INSERT INTO ports VALUES (3, 'Naples', ST_SetSRID(ST_MakePoint(14.16007067, 40.80333333), 4326));
INSERT INTO ports VALUES (4, 'Palermo', ST_SetSRID(ST_MakePoint(13.36984688, 38.13083333), 4326));
INSERT INTO ports VALUES (5, 'Melilla', ST_SetSRID(ST_MakePoint(-2.922850412, 35.28), 4326));
INSERT INTO ports VALUES (6, 'Fiumicino', ST_SetSRID(ST_MakePoint(12.23545347, 41.75583333), 4326));
INSERT INTO ports VALUES (7, 'Ibiza', ST_SetSRID(ST_MakePoint(1.45, 38.9), 4326));
INSERT INTO ports VALUES (8, 'Tunis', ST_SetSRID(ST_MakePoint(10.25, 36.8), 4326));
INSERT INTO ports VALUES (9, 'Bejaia', ST_SetSRID(ST_MakePoint(5.08, 36.75), 4326));
INSERT INTO ports VALUES (10, 'Oran', ST_SetSRID(ST_MakePoint(-0.636690224, 35.7125), 4326));
INSERT INTO ports VALUES (11, 'Almeria', ST_SetSRID(ST_MakePoint(-2.471260306, 36.83222222), 4326));
INSERT INTO ports VALUES (12, 'Cagliari', ST_SetSRID(ST_MakePoint(9.107597173, 39.20416667), 4326));
INSERT INTO ports VALUES (13, 'Alicante', ST_SetSRID(ST_MakePoint(-0.48828033, 38.33527778), 4326));
INSERT INTO ports VALUES (14, 'Valencia', ST_SetSRID(ST_MakePoint(-0.318433451, 39.44416667), 4326));
INSERT INTO ports VALUES (15, 'Ajaccio', ST_SetSRID(ST_MakePoint(8.738810365, 41.92), 4326));
INSERT INTO ports VALUES (16, 'Bastia', ST_SetSRID(ST_MakePoint(9.451943463, 42.7), 4326));
INSERT INTO ports VALUES (17, 'Nice', ST_SetSRID(ST_MakePoint(7.285630153, 43.69388889), 4326));
INSERT INTO ports VALUES (18, 'Livorno', ST_SetSRID(ST_MakePoint(10.30194346, 43.55583333), 4326));
INSERT INTO ports VALUES (19, 'Barcelona', ST_SetSRID(ST_MakePoint(2.168786808, 41.35472222), 4326));
INSERT INTO ports VALUES (20, 'Palma de Mallorca', ST_SetSRID(ST_MakePoint(2.62532391, 39.55111111), 4326));