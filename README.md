# CarthaPirates

![](carte_interactive.png "Carte interactive")

CarthaPirates est une application web utilisée dans le cadre des cours d'Algorithmie et de Programmation assurés au sein du Master 2 Carthagéo :
* Université Panthéon-Sorbonne (Paris 1)
* Université de Paris Cité (Paris 7)
* École Nationale des Sciences Géographiques (ENSG)

## Démarrage de l'application web

### Dans un contexte de développement

Arrêter et nettoyer l'environnement de développement avec la commande `make cleanDev`.

Puis, démarrer l'application avec la commande `make startDev` ou `make watchDev`.

* [localhost:9000](http://localhost:9000/)
  * Application web consommant l'API (jQuery, OpenLayers)
* [localhost:9001](http://localhost:9001/)
  * API consommant la base de données (Node.js, Express, SwaggerUI)
* localhost:9002
  * Base de données (PostgreSQL, PostGIS, PgRouting)

### Dans un contexte de production

Arrêter et nettoyer l'environnement de production avec la commande `make clean`.

Puis, démarrer l'application avec la commande `make start` ou `make watch`.

* [carthapirates.fr](https://carthapirates.fr/)
  * Application web consommant l'API (jQuery, OpenLayers)
* [carthapirates.fr/api](https://carthapirates.fr/api/documentation)
  * API consommant la base de données (Node.js, Express, SwaggerUI)

L'application est hébergée en France ([ScaleWay](https://www.scaleway.com/fr/)).

## Utilisation de l'API (Production)

L'API de l'application Web n'est pas sécurisée. Si l'application est démarrée, l'accès est ouvert à tous.

### Swagger UI

Afin de consommer l'API via Swagger UI, utilisez [cette interface](https://carthapirates.fr/api/documentation/)

### Python

Afin de consommer l'API en Python, consultez le dossier [usages/python](./usages/python)

### Javascript

Afin de consommer l'API en Javascript, consultez le dossier [usages/javascript](./usages/javascript)