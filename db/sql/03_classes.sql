DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
    nom text CONSTRAINT pkey_classes_nom PRIMARY KEY
);

INSERT INTO classes VALUES ('carthageo2023');
INSERT INTO classes VALUES ('carthageo2022');
INSERT INTO classes VALUES ('carthageo2021');