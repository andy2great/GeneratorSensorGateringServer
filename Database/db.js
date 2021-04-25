const { MongoClient } = require('mongodb');
const { COLLECTION } = require('../Constants/DB.constant');

const dbName = 'GeneratriceDB';
//const url = 'mongodb://10.0.0.121:27017';
const url = 'mongodb://localhost:27017';
const mongoOptions = { useNewUrlParser: true };

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

        state.db
          .listCollections()
          .toArray()
          .then((collections) => {
            const collectionNames = collections.map((x) => x.name);

            if (!collectionNames.includes(COLLECTION.SENSEURS))
              state.db.createCollection(COLLECTION.SENSEURS);

            if (!collectionNames.includes(COLLECTION.VALEURREFERENCE))
              state.db.createCollection(COLLECTION.VALEURREFERENCE);

            if (!collectionNames.includes(COLLECTION.USER))
              state.db.createCollection(COLLECTION.USER);
          });

        cb();
      }
    });
  }
};

const getDB = () => {
  return state.db;
};

const ObtenirSenseursData = () => {
  return state.db.collection(COLLECTION.SENSEURS).find().toArray();
};

const ObtenirDernierDonnerSenseur = () => {
  return state.db
    .collection(COLLECTION.SENSEURS)
    .aggregate([
      {
        $group: {
          _id: {
            location: '$location',
            senseur: '$senseur',
          },
          timestamp: { $last: '$timestamp' },
          senseur: { $last: '$senseur' },
          val: { $last: '$val' },
          location: { $last: '$location' },
          modeOpr: { $last: '$modeOpr' },
          tModule: { $last: '$tModule' },
        },
      },
      { $sort: { location: 1 } },
    ])
    .toArray();
};

const getAllModules = () => {
  return state.db
    .collection(COLLECTION.SENSEURS)
    .aggregate([
      {
        $group: {
          _id: {
            location: '$location',
          },
        },
      },
    ])
    .toArray();
};

const ObtenirDonnerParDate = () => {
  return getAllModules().then((res) => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return state.db
      .collection(COLLECTION.SENSEURS)
      .aggregate([
        { $sort: { timestamp: 1 } },
        { $match: { timestamp: { $gte: date } } },
        {
          $group: {
            _id: {
              location: '$location',
              senseur: '$senseur',
            },
            val: {
              $push: {
                timestamp: '$timestamp',
                val: '$val',
              },
            },
          },
        },
      ])
      .toArray();
  });
};

const AjouterSenseursData = (data) => {
  return state.db.collection(COLLECTION.SENSEURS).insertMany(data);
};

const EnleverSenseursData = (data) => {
  return state.db.collection(COLLECTION.SENSEURS).deleteMany(data);
};

const ObtenirRefValeur = (data) => {
  return state.db.collection(COLLECTION.VALEURREFERENCE).find(data).toArray();
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
