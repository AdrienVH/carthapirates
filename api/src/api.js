const { getBateaux, getBateau, createBateau, getBateauxByLonLat, deplacerBateau, rentrerBateau, deleteBateau } = require('./crud/bateaux')
const { getPorts, getPort, createPort, getPortsByLonLat, deletePort } = require('./crud/ports')
const { getTrajets, getTrajetsBateau, deleteTrajets } = require('./crud/trajets')
const { getClasses, getClasse, createClasse, deleteClasse } = require('./crud/classes')
const express = require('express')
const cors = require('cors')
const SSE = require('express-sse')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const api = express()
const port = 8080
const swaggerJSDocOptions = {
	definition: {
		info: { title: 'Documentation de l\'API', version: '1.0.0' },
		servers: [{ url: "http://localhost:9001" }]
	},
	apis: ['./src/api.js'],
}
const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions)
const SwaggerOptions = { customCss: '.curl-command { display: none }' }

api.use(express.json())
api.use(cors())
api.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec, SwaggerOptions))
api.listen(port, () => { console.log('REST API is up') })

// SSE

const sse = new SSE()
api.get('/stream', sse.init);

/**
 * @swagger
 *
 * tags:
 *  name: Bateaux
 */

/**
 * @swagger
 *
 * /bateaux:
 *   get:
 *     description: Récupère la liste des bateaux
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La liste des bateaux a bien été récupérée
 */
api.get('/bateaux', async (req, res) => {
	const bateaux = await getBateaux()
	res.status(200).json(bateaux)
})

/**
 * @swagger
 *
 * /bateaux/{identifiant}:
 *   get:
 *     description: Récupère un bateau
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du bateau
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Le bateau a bien été récupéré
 */
api.get('/bateaux/:identifiant', async (req, res) => {
	const idBateau = parseInt(req.params.identifiant)
	const bateau = await getBateau(idBateau)
	res.status(200).json(bateau)
})

/**
 * @swagger
 *
 * /bateaux:
 *   post:
 *     description: Crée un bateau
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: classe
 *         description: Nom de la classe du bateau à créer
 *         in: query
 *         required: true
 *         type: string
 *       - name: nom
 *         description: Nom du bateau à créer
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Le bateau a bien été créé
 *       500:
 *         description: Une erreur est survenue
 */
api.post('/bateaux/', async (req, res) => {
	try {
		const classe = req.query.classe
		const nom = req.query.nom
		const bateau = await createBateau(classe, nom)
		res.status(201).json(bateau)
	} catch (err) {
		const erreurs = err.errors ? err.errors.map(err => err.message) : ['Erreur inconnue']
		res.status(500).json({ code: 500, erreurs })
	}
})

/**
 * @swagger
 *
 * /bateaux/{identifiant}:
 *   put:
 *     description: Modifie la localisation d'un bateau
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du bateau
 *         in: path
 *         required: true
 *         type: integer
 *       - name: longitude
 *         description: Longitude de la nouvelle position du bateau
 *         in: query
 *         required: true
 *         type: number
 *       - name: latitude
 *         description: Latitude de la nouvelle position du bateau
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       201:
 *         description: La localisation du bateau a bien été modifiée
 */
api.put('/bateaux/:identifiant', async (req, res) => {
	const idBateau = parseInt(req.params.identifiant)
	const lon = parseFloat(req.query.longitude)
	const lat = parseFloat(req.query.latitude)
	const content = await deplacerBateau(idBateau, lon, lat)
	res.status(201).json(content.bateau)
	sse.send({ type: 'deplacerBateau', content })
})

/**
 * @swagger
 *
 * /bateaux/{identifiant}/rentrer:
 *   put:
 *     description: Retire la localisation d'un bateau
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du bateau
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       201:
 *         description: La localisation du bateau a bien été retirée
 */
 api.put('/bateaux/:identifiant/rentrer', async (req, res) => {
	const idBateau = parseInt(req.params.identifiant)
	await rentrerBateau(idBateau)
	await deleteTrajets(idBateau)
	res.status(201).json('Le bateau a bien été retiré')
	sse.send({ type: 'rentrerBateau', content: { idBateau } })
})

/**
 * @swagger
 *
 * /bateaux/{identifiant}:
 *   delete:
 *     description: Supprime un bateau
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du bateau
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Le bateau a bien été supprimé
 *       404:
 *         description: Aucun bateau n'a été supprimé
 */
api.delete('/bateaux/:identifiant', async (req, res) => {
	const deleted = await deleteBateau(req.params.identifiant)
	if(deleted == 1){
		res.status(200).json("Le bateau a bien été supprimé")
	}else{
		res.status(404).json("Aucun bateau n'a été supprimé")
	}
})

/**
 * @swagger
 *
 * /bateaux/proches/{nombre}/{longitude}/{latitude}:
 *   get:
 *     description: Récupère les bateaux les plus proches de coordonnées
 *     tags: [Bateaux]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nombre
 *         description: Nombre de bateaux à récupérer
 *         in: path
 *         required: true
 *         type: integer
 *       - name: longitude
 *         description: Longitude
 *         in: path
 *         required: true
 *         type: number
 *       - name: latitude
 *         description: Latitude
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Le bateau a bien été récupéré
 */
api.get('/bateaux/proches/:nombre/:longitude/:latitude', async (req, res) => {
	const bateaux = await getBateauxByLonLat(req.params.longitude, req.params.latitude, req.params.nombre)
	res.status(200).json(bateaux)
})

 /**
 * @swagger
 *
 * tags:
 *  name: Ports
 */

/**
 * @swagger
 *
 * /ports:
 *   get:
 *     description: Récupère la liste des ports
 *     tags: [Ports]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La liste des ports a bien été récupérée
 */
api.get('/ports', async (req, res) => {
	const ports = await getPorts()
	res.status(200).json(ports)
})

/**
 * @swagger
 *
 * /ports/{identifiant}:
 *   get:
 *     description: Récupère un port
 *     tags: [Ports]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du port
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Le port a bien été récupéré
 */
api.get('/ports/:identifiant', async (req, res) => {
	const port = await getPort(req.params.identifiant)
	res.status(200).json(port)
})

/**
 * @swagger
 *
 * /ports:
 *   post:
 *     description: Crée un port
 *     tags: [Ports]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nom
 *         description: Nom du port à créer
 *         in: query
 *         required: true
 *         type: string
 *       - name: longitude
 *         description: Longitude
 *         in: query
 *         required: true
 *         type: number
 *       - name: latitude
 *         description: Latitude
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       201:
 *         description: Le port a bien été créé
 *       500:
 *         description: Une erreur est survenue
 */
api.post('/ports', async (req, res) => {
	try {
		const nom = req.query.nom
		const latitude = req.query.latitude
		const longitude = req.query.longitude
		const port = await createPort(nom, longitude, latitude)
		res.status(201).json(port)
	} catch (error) {
		const erreurs = error.errors.map(err => err.message);
		res.status(500).json({ code: 500, erreurs })
	}
})

/**
 * @swagger
 *
 * /ports/{identifiant}:
 *   delete:
 *     description: Supprime un port
 *     tags: [Ports]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du port
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Le port a bien été supprimé
 *       404:
 *         description: Aucun port n'a été supprimé
 */
api.delete('/ports/:identifiant', async (req, res) => {
	const deleted = await deletePort(req.params.identifiant)
	if(deleted == 1){
		res.status(200).json("Le port a bien été supprimé")
	}else{
		res.status(404).json("Aucun port n'a été supprimé")
	}
})

/**
 * @swagger
 *
 * /ports/proches/{nombre}/{longitude}/{latitude}:
 *   get:
 *     description: Récupère les ports les plus proches de coordonnées
 *     tags: [Ports]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nombre
 *         description: Nombre de ports à récupérer
 *         in: path
 *         required: true
 *         type: integer
 *       - name: longitude
 *         description: Longitude
 *         in: path
 *         required: true
 *         type: number
 *       - name: latitude
 *         description: Latitude
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Les ports ont bien été récupérés
 */
api.get('/ports/proches/:nombre/:longitude/:latitude', async (req, res) => {
	const ports = await getPortsByLonLat(req.params.longitude, req.params.latitude, req.params.nombre)
	res.status(200).json(ports)
})

/**
 * @swagger
 *
 * tags:
 *  name: Trajets
 */

/**
 * @swagger
 *
 * /trajets:
 *   get:
 *     description: Récupère la liste des trajets
 *     tags: [Trajets]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La liste des trajets a bien été récupérée
 */
 api.get('/trajets', async (req, res) => {
	const trajets = await getTrajets()
	res.status(200).json(trajets)
})

/**
 * @swagger
 *
 * /trajets/bateau/{identifiant}:
 *   get:
 *     description: Récupère les trajets d'un bateau
 *     tags: [Trajets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du bateau
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Les trajets du bateau ont bien été récupérés
 */
 api.get('/trajets/bateau/:identifiant', async (req, res) => {
	const idBateau = parseInt(req.params.identifiant)
	const trajets = await getTrajetsBateau(idBateau)
	res.status(200).json(trajets)
})

/**
 * @swagger
 *
 * /trajets/{identifiant}:
 *   delete:
 *     description: Supprime les trajets d'un bateau
 *     tags: [Trajets]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du bateau
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Les trajets du bateau ont bien été supprimés
 *       404:
 *         description: Aucun trajet n'a été supprimé
 */
 api.delete('/trajets/:identifiant', async (req, res) => {
	const idBateau = req.params.identifiant
	const deleted = await deleteTrajets(idBateau)
	if (deleted > 0) {
		res.status(200).json("Les " + deleted + " trajets du bateau " + idBateau + " ont bien été supprimés")
	} else {
		res.status(200).json("Aucun trajet n'a été supprimé")
	}
})

/**
 * @swagger
 *
 * tags:
 *  name: Classes
 */

/**
 * @swagger
 *
 * /classes:
 *   get:
 *     description: Récupère la liste des classes
 *     tags: [Classes]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La liste des classes a bien été récupérée
 */
 api.get('/classes', async (req, res) => {
	const classes = await getClasses()
	res.status(200).json(classes)
})

/**
 * @swagger
 *
 * /classes/{nom}:
 *   get:
 *     description: Récupère une classe
 *     tags: [Classes]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nom
 *         description: Nom de la classe
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: La classe a bien été récupérée
 *       404:
 *         description: Aucune classe ne porte ce nom
 */
 api.get('/classes/:nom', async (req, res) => {
	const nom = req.params.nom
	const classe = await getClasse(nom)
	if (classe) {
		res.status(200).json(classe)
	} else {
		res.status(404).json({ code: 404, erreurs: ['Aucune classe ne porte ce nom'] })
	}
})

/**
 * @swagger
 *
 * /classes:
 *   post:
 *     description: Crée une classe
 *     tags: [Classes]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nom
 *         description: Nom de la classe à créer
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: La classe a bien été créée
 *       500:
 *         description: Une erreur est survenue
 */
api.post('/classes', async (req, res) => {
	try {
		const nom = req.query.nom
		const classe = await createClasse(nom)
		res.status(201).json(classe)
	} catch (error) {
		const erreurs = error.errors.map(err => err.message);
		res.status(500).json({ code: 500, erreurs })
	}
})

/**
 * @swagger
 *
 * /classes/{nom}:
 *   delete:
 *     description: Supprime une classe
 *     tags: [Classes]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nom
 *         description: Nom de la classe
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: La classe a bien été supprimée
 *       404:
 *         description: Aucune classe n'a été supprimée
 */
 api.delete('/classes/:nom', async (req, res) => {
	const deleted = await deleteClasse(req.params.nom)
	if(deleted == 1){
		res.status(200).json("La classe a bien été supprimée")
	}else{
		res.status(404).json("Aucune classe n'a été supprimée")
	}
})