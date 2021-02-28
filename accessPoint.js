const express = require("express"); // librairie du node_module qui gère les endpoint
const bodyParser = require("body-parser"); // librairie du node_module qui parse
const db = require("./db"); // inclue le fichier db.js
const cors = require("cors");

const app = express(); // app gère les endpoints
const jsonParser = bodyParser.json(); // parse JSON
const port = 59595; // Important: Défini le port ici
// const repertoire= '/'

var index = 0;

// donner référence à "app" pour faire des end point.
getExpress = () => {
  return app;
};

setup = () => {
  const allowedOrigins = ["http://localhost:3000", "http://10.0.0.116:3000"];

  app.use(
    cors({
      origin: function (origin, callback) {
        /*if (!origin) return callback(null, true)
                if (allowedOrigins.indexOf(origin) === -1) {
                    var msg =
                        "The CORS policy for this site does not " +
                        "allow access from the specified Origin."
                    return callback(new Error(msg), false)
                }*/
        return callback(null, true);
      },
    })
  );

  // tout au long, utilise JSON parser
  app.use(jsonParser);

  // Point accès pour obtenir les valeurs de référence
  app.get("/reference/obtenir", (req, res) => {
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
  app.get("/senseurs/obtenir", (req, res) => {
    db.ObtenirSenseursData().then((data) => {
      res.send(data);
    });
  });

  app.get("/senseurs/last", (req, res) => {
    db.ObtenirDernierDonnerSenseur().then((result) => {
      res.send(result);
    });
  });

  app.get("/senseurs/chart", (req, res) => {
    db.ObtenirDonnerParDate().then((result) => {
      res.send(result);
    });
  });

  app.get("/yolo", (req, res) => {
    res.send("good job");
  });

  app.post("/senseurs/soummettre", (req, res) => {
    console.log(req.body, index++);

    // ajouter timestamps dans la liste avec la fonction map
    // assurer JSON est en array
    data = req.body.map((x) => {
      return {
        timestamp: new Date(),
        ...x,
      };
    });

    db.AjouterSenseursData(data);
    res.send("Roger that captain");
  });

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

module.exports = {
  getExpress,
  setup,
};
