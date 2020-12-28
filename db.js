const { MongoClient, ObjectID } = require("mongodb")
const dbName = "GeneratriceDB"
const url = "mongodb://localhost:27017"
const mongoOptions = { useNewUrlParser: true }

const COLLECTION_SENSEURS = 'Senseurs'

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

const getAllData = () => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .find()
    .toArray();
}

const addData = (data) => {
  return state
    .db
    .collection(COLLECTION_SENSEURS)
    .insertMany(data);
}

module.exports = {
  connect,
  getDB,
  getAllData,
  addData,
};
