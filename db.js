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

const ObtenirRefValeur = () => {
  return state
    .db
    .collection(COLLECTION_VALEURREFERENCE)
    .find()
    .toArray()
}

// Ce module permet d'exposer les fonctions ci-haut. 
module.exports = {
  connect,
  getDB,
  ObtenirSenseursData,
  AjouterSenseursData,
  EnleverSenseursData,
  ObtenirRefValeur,
};
