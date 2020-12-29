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

const getAllSensorData = () => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .find()
    .toArray()
}

const addSensorData = (data) => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .insertMany(data)
}

const deleteSensorData = (data) => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .deleteMany(data)
}

const getAllRefData = () => {
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
  getAllSensorData,
  addSensorData,
  deleteSensorData,
  getAllRefData,
};
