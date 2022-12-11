DROP TABLE IF EXISTS bateaux;
CREATE TABLE bateaux (
    id serial CONSTRAINT pkey_bateaux_id PRIMARY KEY,
    nom text NOT NULL,
    nom_classe text NOT NULL,
    geom geometry(POINT, 4326),
    CONSTRAINT fkey_bateaux_classes FOREIGN KEY(nom_classe) REFERENCES classes(nom) ON DELETE CASCADE
);

-- Enseignants
INSERT INTO bateaux VALUES (0,       'El Professor',                  'carthageo2023', NULL);

-- Etudiants
INSERT INTO bateaux VALUES (DEFAULT, 'PimpMyBoat',                    'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'SQMer',                         'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'Guin''anne''s Revenge',         'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'L''Algonaute',                  'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'Le Pourfendeur de Bière',       'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'Pyrte-avion Charles de Gaulle', 'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'La Pynta',                      'carthageo2023', NULL);
INSERT INTO bateaux VALUES (DEFAULT, 'πThon des Mers',                'carthageo2023', NULL);