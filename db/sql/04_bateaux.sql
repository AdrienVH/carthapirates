DROP TABLE IF EXISTS bateaux;
CREATE TABLE bateaux (
    id integer CONSTRAINT pkey_bateaux_id PRIMARY KEY,
    nom text,
    id_classe text,
    geom geometry(POINT, 4326),
    CONSTRAINT fkey_bateaux_classes FOREIGN KEY(id_classe) REFERENCES classes(nom)
);

-- Enseignants
INSERT INTO bateaux VALUES (0, 'El Professor',                  'carthageo2023', NULL);

-- Etudiants
INSERT INTO bateaux VALUES (1, 'PimpMyBoat',                    'carthageo2023', NULL);
INSERT INTO bateaux VALUES (2, 'SQMer',                         'carthageo2023', NULL);
INSERT INTO bateaux VALUES (3, 'Guin''anne''s Revenge',         'carthageo2023', NULL);
INSERT INTO bateaux VALUES (4, 'L''Algonaute',                  'carthageo2023', NULL);
INSERT INTO bateaux VALUES (5, 'Le Pourfendeur de Bière',       'carthageo2023', NULL);
INSERT INTO bateaux VALUES (6, 'Pyrte-avion Charles de Gaulle', 'carthageo2023', NULL);
INSERT INTO bateaux VALUES (7, 'La Pynta',                      'carthageo2023', NULL);
INSERT INTO bateaux VALUES (8, 'πThon des Mers',                'carthageo2023', NULL);