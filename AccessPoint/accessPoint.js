const express = require('express'); // librairie du node_module qui gère les endpoint
const bodyParser = require('body-parser'); // librairie du node_module qui parse
const db = require('../Database/db'); // inclue le fichier db.js
const cors = require('cors');
const authService = require('../Services/auth.service');

const app = express(); // app gère les endpoints
const jsonParser = bodyParser.json(); // parse JSON
const port = 59595; // Important: Défini le port ici
// const repertoire= '/'

var index = 0;

// donner référence à "app" pour faire des end point.
const getExpress = () => {
  return app;
};

const setup = () => {
  const allowedOrigins = ['http://localhost:3000', 'http://10.0.0.116:3000'];

  app.set('trust proxy', true);

  app.use(
    cors({
      origin: function (origin, callback) {
        return callback(null, true);
      },
    })
  );

  // tout au long, utilise JSON parser
  app.use(jsonParser);

  // Point accès pour obtenir les valeurs de référence
  app.get('/reference/obtenir', authService.isModuleReal, (req, res) => {
    db.ObtenirRefValeur().then((data) => {
      res.send(
        data.map((x, i) => ({
          ...x,
          _id: i,
        }))
      );
    });
  });

  // Point accès pour obtenir les valeurs de référence
  app.get('/senseurs/obtenir', authService.isModuleReal, (req, res) => {
    db.ObtenirSenseursData().then((data) => {
      res.send(data);
    });
  });

  app.get('/senseurs/last', authService.isLoggedIn, (req, res) => {
    db.ObtenirDernierDonnerSenseur(req.modules).then((result) => {
      res.send(result);
    });
  });

  app.get('/senseurs/chart', authService.isLoggedIn, (req, res) => {
    db.ObtenirDonnerParDate(req.modules).then((result) => {
      res.send(result);
    });
  });

  app.post('/senseurs/soummettre', authService.isModuleReal, (req, res) => {
    console.log(req.body, index++);

    // ajouter timestamps dans la liste avec la fonction map
    // assurer JSON est en array
    const data = req.body.map((x) => {
      return {
        ...x,
        timestamp: new Date(),
        module: req.module._id,
      };
    });

    db.AjouterSenseursData(data);
    res.send('Roger that captain');
  });

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

  require('./Authentication/auth');
};

module.exports = {
  getExpress,
  setup,
};
