DROP TABLE IF EXISTS trajets;
CREATE TABLE trajets (
    id serial CONSTRAINT pkey_trajets_id PRIMARY KEY,
    id_bateau integer,
    date date,
    geom geometry(LINESTRING, 4326),
    deleted boolean,
    CONSTRAINT fkey_trajets_bateaux FOREIGN KEY(id_bateau) REFERENCES bateaux(id)
);