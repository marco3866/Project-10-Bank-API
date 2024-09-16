const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const dbConnection = require('./database/connection');

// Charger les fichiers YAML Swagger
const swaggerDocs = yaml.load('./swagger.yaml');
const swaggerFuturDocs = yaml.load('./swaggerfutur.yaml'); // Nouveau fichier swagger futur

dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connecter à la base de données
dbConnection();

// Gérer les problèmes CORS
app.use(cors());

// Middleware pour les payloads des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes pour l'API utilisateur
app.use('/api/v1/user', require('./routes/userRoutes'));

// Documentation API Swagger pour swagger.yaml
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Documentation API Swagger pour swaggerfutur.yaml
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-futur-docs', swaggerUi.serve, swaggerUi.setup(swaggerFuturDocs));
}

// Route de test basique
app.get('/', (req, res) => {
  res.send('Hello from my Express server v2!');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
