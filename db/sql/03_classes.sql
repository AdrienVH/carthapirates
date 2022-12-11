DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
    id serial,
    nom text CONSTRAINT pkey_classes_nom PRIMARY KEY
);

INSERT INTO classes VALUES (DEFAULT, 'carthageo2023');
INSERT INTO classes VALUES (DEFAULT, 'carthageo2022');
INSERT INTO classes VALUES (DEFAULT, 'carthageo2021');