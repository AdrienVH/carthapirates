const { getBateaux, getBateau, getBateauxByLonLat, putBateau, deleteBateau } = require('./crud/bateaux')
const { getPorts, getPort, createPort, getPortsByLonLat, deletePort } = require('./crud/ports')
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
	const bateaux = await getBateau(req.params.identifiant)
	res.status(200).json(bateaux)
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
	const bateau = await putBateau(req.params.identifiant, req.query.longitude, req.query.latitude)
	res.status(201).json(bateau)
	sse.send(bateau);
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
	const ports = await getPort(req.params.identifiant)
	res.status(200).json(ports)
})

/**
 * @swagger
 *
 * /ports/{identifiant}/{nom}/{longitude}/{latitude}:
 *   post:
 *     description: Crée un port
 *     tags: [Ports]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du port à créer
 *         in: path
 *         required: true
 *         type: integer
 *       - name: nom
 *         description: Nom du port à créer
 *         in: path
 *         required: true
 *         type: string
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
 *       201:
 *         description: Le port a bien été créé
 */
api.post('/ports/:identifiant/:nom/:longitude/:latitude', async (req, res) => {
	const ports = await createPort(req.params.identifiant, req.params.nom, req.params.longitude, req.params.latitude)
	res.status(201).json(ports)
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
