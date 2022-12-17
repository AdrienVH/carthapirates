# Pour commencer...

## Vous êtes enseignant(e) ?

Rendez-vous sur [carthapirates.fr/api/documentation/](https://carthapirates.fr/api/documentation/).

Créez une flotte pour votre classe à l'aide du service `POST /flotte`, en indiquant le nom de votre flotte.

Vérifiez la création de votre flotte à l'aide du service `GET /flotte/{nom}`, en indiquant le nom de votre flotte.

Créez votre bateau à l'aide du service `POST /bateaux`, en indiquant le nom de votre flotte et le nom de votre bateau.

**Notez bien l'identifiant de votre bateau !**

Enfin, communiquez le nom de la flotte à vos étudiants, afin qu'ils puissent créer leur propre bateau.

## Vous êtes étudiant(e) ?

Récupérez, auprès de votre enseignant(e), le nom de la flotte créée pour votre classe.

Rendez-vous sur [carthapirates.fr/api/documentation/](https://carthapirates.fr/api/documentation/).

Vérifiez l'existence de cette flotte à l'aide du service `GET /flotte/{nom}`.

Enfin, créez votre bateau à l'aide du service `POST /bateaux`, en indiquant le nom de votre flotte et le nom de votre bateau.

**Notez bien l'identifiant de votre bateau !**

---

# Pour continuer...

Maintenant que vous avez votre bateau, il vous est possible de le faire interagir avec [la carte](https://carthapirates.fr/), toujours via l'API. La consommation des différents services offerts par l'API peut se faire de plusieurs manières différentes :

## En utilisant un client existant

Vous pouvez continuer à utiliser les services de l'API depuis sa documentation (qui fait office de client) :
[carthapirates.fr/api/documentation/](https://carthapirates.fr/api/documentation/)

Mais vous pouvez aussi utiliser n'import quel client capable de faire des appels à une API.
Postman, par exemple, ou encore CURL :

```curl -s https://carthapirates.fr/api/bateaux | jq```

```curl -s https://carthapirates.fr/api/ports | jq```

## En construisant votre propre client

### Grâce au langage Python

Vous pouvez consulter un exemple d'implémentation en Python : [usages/python](./python)

### Grâce au langage Javascript

Vous pouvez consulter un exemple d'implémentation en Javascript : [usages/javascript](./javascript)