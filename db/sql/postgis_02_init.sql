--- CLASSES ---

DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
    nom text CONSTRAINT pkey_classes_nom PRIMARY KEY
);

INSERT INTO classes VALUES ('carthageo2023');
INSERT INTO classes VALUES ('carthageo2022');
INSERT INTO classes VALUES ('carthageo2021');

--- BATEAUX ---

DROP TABLE IF EXISTS bateaux;
CREATE TABLE bateaux (
    id integer CONSTRAINT pkey_bateaux_id PRIMARY KEY,
    nom text,
    id_classe text,
    geom geometry(POINT, 4326),
    CONSTRAINT fkey_bateaux_classes FOREIGN KEY(id_classe) REFERENCES classes(nom)
);

INSERT INTO bateaux VALUES (1, 'PimpMyBoat',                    'carthageo2023', ST_SetSRID(ST_MakePoint(-0.869982, 37.027210), 4326));
INSERT INTO bateaux VALUES (2, 'SQMer',                         'carthageo2023', ST_SetSRID(ST_MakePoint(2.409849, 37.828604), 4326));
INSERT INTO bateaux VALUES (3, 'Guin''anne''s Revenge',         'carthageo2023', ST_SetSRID(ST_MakePoint(5.995090, 37.901985), 4326));
INSERT INTO bateaux VALUES (4, 'L''Algonaute',                  'carthageo2023', ST_SetSRID(ST_MakePoint(12.342294, 39.138232), 4326));
INSERT INTO bateaux VALUES (5, 'Le Pourfendeur de Bière',       'carthageo2023', ST_SetSRID(ST_MakePoint(4.381714, 42.450092), 4326));
INSERT INTO bateaux VALUES (6, 'Pyrte-avion Charles de Gaulle', 'carthageo2023', ST_SetSRID(ST_MakePoint(2.570165, 40.580606), 4326));
INSERT INTO bateaux VALUES (7, 'La Pynta',                      'carthageo2023', ST_SetSRID(ST_MakePoint(10.337215, 40.706392), 4326));
INSERT INTO bateaux VALUES (8, 'πThon des Mers',                'carthageo2023', ST_SetSRID(ST_MakePoint(3.598341, 39.177989), 4326));

--- PORTS ---

DROP TABLE IF EXISTS ports;
CREATE TABLE ports (
    id integer CONSTRAINT pkey_ports_id PRIMARY KEY,
    nom text,
    geom geometry(POINT, 4326)
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

--- TRAJETS ---

DROP TABLE IF EXISTS trajets;
CREATE TABLE trajets (
    id serial CONSTRAINT pkey_trajets_id PRIMARY KEY,
    id_bateau integer,
    date date,
    geom geometry(MULTILINESTRING, 4326),
    CONSTRAINT fkey_trajets_bateaux FOREIGN KEY(id_bateau) REFERENCES bateaux(id)
);