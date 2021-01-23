const { MongoClient } = require("mongodb")
const dbName = "GeneratriceDB"
const url = "mongodb://localhost:27017"
const mongoOptions = { useNewUrlParser: true }

const COLLECTION_SENSEURS = 'Senseurs'
const COLLECTION_VALEURREFERENCE = 'ValeurReference'

const state = {
  db: null
};

const connect = cb => {
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
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .find()
    .toArray()
}

const ObtenirDernierDonnerSenseur = () => {
  return state
      .db
      .collection(COLLECTION_SENSEURS)
      .aggregate([
        {
            $group: {
                _id: {
                    'location': '$location',
                    'senseur': '$senseur'
                },
                timestamp: { $last: "$timestamp" },
                senseur: { $last: "$senseur" },
                val: { $last: "$val" },
                Location: { $last: "$location" },
                ModeOpr: { $last: "$modeOpr" },
                tModule: { $last: "$tModule" }
            },
        },
      ])
      .toArray()
}

const AjouterSenseursData = (data) => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .insertMany(data)
}

const EnleverSenseursData = (data) => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .deleteMany(data)
}

const ObtenirRefValeur = (data) => {
  return state
    .db
    .collection(COLLECTION_VALEURREFERENCE)
    .find(data)
    .toArray()
}

// Ce module permet d'exposer les fonctions ci-haut. 
module.exports = {
  connect,
  getDB,
  ObtenirSenseursData,
  ObtenirDernierDonnerSenseur,
  AjouterSenseursData,
  EnleverSenseursData,
  ObtenirRefValeur,
};
