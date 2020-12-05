const { getMoyens, getMoyen, getMoyensByLonLat, putMoyen, deleteMoyen } = require('./crud/moyen')
const { getSites, getSite, getSitesByLonLat } = require('./crud/site')
const express = require('express')
const cors = require('cors')
const SSE = require('express-sse')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const api = express()
const port = 8080
const swaggerJSDocOptions = {
	definition: {
		info: { title: 'Documentation de l\'API de MyFirstApp', version: '1.2.3' },
		servers: [{ url: "http://localhost:9001" }]
	},
	apis: ['./src/api.js'],
}
const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions)
const SwaggerOptions = { customCss: '.curl-command { display: none }' }

api.use(express.json())
api.use(cors())
api.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec, SwaggerOptions))
api.listen(port, () => {
	console.log('REST API is up')
})

// SSE

const sse = new SSE()
api.get('/stream', sse.init);

/**
 * @swagger
 *
 * tags:
 *  name: Moyen
 *  description: Bateaux
 */

/**
 * @swagger
 *
 * /moyen/{identifiant}:
 *   put:
 *     description: Modifie la localisation d'un moyen
 *     tags: [Moyen]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du moyen
 *         in: path
 *         required: true
 *         type: string
 *       - name: longitude
 *         description: Longitude de la nouvelle position du moyen
 *         in: query
 *         required: true
 *         type: number
 *       - name: latitude
 *         description: Latitude de la nouvelle position du moyen
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       201:
 *         description: La localisation du moyen a bien été modifiée
 */
api.put('/moyen/:identifiant', async (req, res) => {
	const moyen = await putMoyen(req.params.identifiant, req.query.longitude, req.query.latitude)
	res.status(201).json(moyen)
	sse.send(moyen);
})

/**
 * @swagger
 *
 * /moyens:
 *   get:
 *     description: Récupère la liste des moyens
 *     tags: [Moyen]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La liste des moyens a bien été récupérée
 */
api.get('/moyens', async (req, res) => {
	const moyens = await getMoyens()
	res.status(200).json(moyens)
})

/**
 * @swagger
 *
 * /moyen/{identifiant}:
 *   get:
 *     description: Récupère un moyen
 *     tags: [Moyen]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du moyen
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Le moyen a bien été récupéré
 */
api.get('/moyen/:identifiant', async (req, res) => {
	const moyens = await getMoyen(req.params.identifiant)
	res.status(200).json(moyens)
})

/**
 * @swagger
 *
 * /moyens/nearest/{nombre}/{longitude}/{latitude}:
 *   get:
 *     description: Récupère le moyen le plus proche de coordonnées
 *     tags: [Moyen]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nombre
 *         description: Nombre de moyens à récupérer
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
 *         description: Le moyen a bien été récupéré
 */
api.get('/moyens/nearest/:nombre/:longitude/:latitude', async (req, res) => {
	const moyens = await getMoyensByLonLat(req.params.longitude, req.params.latitude, req.params.nombre)
	res.status(200).json(moyens)
})

/**
 * @swagger
 *
 * /moyen/{identifiant}:
 *   delete:
 *     description: Supprime un moyen
 *     tags: [Moyen]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du moyen
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Le moyen a bien été supprimé
 *       404:
 *         description: Aucun moyen n'a été supprimé
 */
api.delete('/moyen/:identifiant', async (req, res) => {
	const deleted = await deleteMoyen(req.params.identifiant)
	if(deleted == 1){
		res.status(200).json("Le moyen a bien été supprimé")
	}else{
		res.status(404).json("Aucun moyen n'a été supprimé")
	}
})

 /**
 * @swagger
 *
 * tags:
 *  name: Site
 *  description: Ports
 */

/**
 * @swagger
 *
 * /sites:
 *   get:
 *     description: Récupère la liste des sites
 *     tags: [Site]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La liste des sites a bien été récupérée
 */
api.get('/sites', async (req, res) => {
	const sites = await getSites()
	res.status(200).json(sites)
})

/**
 * @swagger
 *
 * /site/{identifiant}:
 *   get:
 *     description: Récupère un site
 *     tags: [Site]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: identifiant
 *         description: Identifiant du site
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Le site a bien été récupéré
 */
api.get('/site/:identifiant', async (req, res) => {
	const sites = await getSite(req.params.identifiant)
	res.status(200).json(sites)
})

/**
 * @swagger
 *
 * /sites/nearest/{nombre}/{longitude}/{latitude}:
 *   get:
 *     description: Récupère les n sites les plus proches de coordonnées
 *     tags: [Site]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nombre
 *         description: Nombre de sites à récupérer
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
 *         description: Les sites ont bien été récupérés
 */
api.get('/sites/nearest/:nombre/:longitude/:latitude', async (req, res) => {
	const sites = await getSitesByLonLat(req.params.longitude, req.params.latitude, req.params.nombre)
	res.status(200).json(sites)
})
