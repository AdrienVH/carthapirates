carthageo-algopython-webapp
=================

Introduction
-----------------

Cette application est utilisée pour illustrer les cours d'Algorithmie et Programmation assurés au sein du Master 2 Carthagéo Pro (Universités Paris 1 et Paris 7, Ecole Nationale des Sciences Géographiques).

Fonctionnement
-----------------

Lancer l'application avec la commande `docker-compose up --build -d` pour avoir accès à :

* [localhost:9000](http://localhost:9000/) : Application web consommant l'API (jQuery, OpenLayers)
* [localhost:9001](http://localhost:9001/documentation/) : API consommant la base de données PostgreSQL/PostGIS (Node.js, Express, SwaggerUI)
