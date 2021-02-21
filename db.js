const { MongoClient } = require("mongodb");
const dbName = "GeneratriceDB";
const url = "mongodb://10.0.0.121:27017";
const mongoOptions = { useNewUrlParser: true };

const COLLECTION_SENSEURS = "Senseurs";
const COLLECTION_VALEURREFERENCE = "ValeurReference";

const state = {
  db: null,
};

const connect = (cb) => {
  if (state.db) {
    cb();
  } else {
    return MongoClient.connect(url, mongoOptions, (err, client) => {
      if (err) {
        cb(err);
      } else {
        state.db = client.db(dbName);
        cb();
      }
    });
  }
};

const getDB = () => {
  return state.db;
};

const ObtenirSenseursData = () => {
  return state.db.collection(COLLECTION_SENSEURS).find().toArray();
};

const ObtenirDernierDonnerSenseur = () => {
  return state.db
    .collection(COLLECTION_SENSEURS)
    .aggregate([
      {
        $group: {
          _id: {
            location: "$location",
            senseur: "$senseur",
          },
          timestamp: { $last: "$timestamp" },
          senseur: { $last: "$senseur" },
          val: { $last: "$val" },
          location: { $last: "$location" },
          modeOpr: { $last: "$modeOpr" },
          tModule: { $last: "$tModule" },
        },
      },
      { $sort: { location: 1 } },
    ])
    .toArray();
};

const getAllModules = () => {
  return state.db
    .collection(COLLECTION_SENSEURS)
    .aggregate([
      {
        $group: {
          _id: {
            location: "$location",
          },
        },
      },
    ])
    .toArray();
};

const ObtenirDonnerParDate = () => {
  return getAllModules().then((res) => {
    return state.db
      .collection(COLLECTION_SENSEURS)
      .aggregate([
        { $sort: { timestamp: 1 } },
        {
          $group: {
            _id: {
              location: "$location",
              senseur: "$senseur",
            },
            val: {
              $push: {
                timestamp: "$timestamp",
                val: "$val",
              },
            },
          },
        },
      ])
      .toArray();
  });
};

const AjouterSenseursData = (data) => {
  return state.db.collection(COLLECTION_SENSEURS).insertMany(data);
};

const EnleverSenseursData = (data) => {
  return state.db.collection(COLLECTION_SENSEURS).deleteMany(data);
};

const ObtenirRefValeur = (data) => {
  return state.db.collection(COLLECTION_VALEURREFERENCE).find(data).toArray();
};

// Ce module permet d'exposer les fonctions ci-haut.
module.exports = {
  connect,
  getDB,
  ObtenirSenseursData,
  ObtenirDernierDonnerSenseur,
  ObtenirDonnerParDate,
  AjouterSenseursData,
  EnleverSenseursData,
  ObtenirRefValeur,
};
