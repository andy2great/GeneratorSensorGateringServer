const db = require('./db');
const crypto = require('crypto');
const { COLLECTION } = require('../Constants/DB.constant');

const salt1 = 'RTEWY4[5wylpgw[-fi0q4tu905w4jgtsmvq';
const salt2 = "'gw;lh[pnrs-0aoe5fDFSHU;ly5sp4[oa0r-D";
const salt3 = 'GBGS%#_$OT{EFadVB3qtGA}VW#PR@QWY^%JUdfsdv';

const getPassHash = (password) => {
  return crypto
    .createHash('sha256')
    .update(salt1 + ' | ' + password)
    .digest('hex');
};

const Login = (email, unencryptPassword) => {
  const password = getPassHash(unencryptPassword);

  return db
    .getDB()
    .collection(COLLECTION.USER)
    .findOne({ email, password })
    .then((res) => {
      if (!res) return null;

      return updateToken(res.email, null);
    });
};

const updateToken = (email, token) => {
  const future = new Date();
  future.setHours(future.getHours() + 24);
  return db
    .getDB()
    .collection(COLLECTION.USER)
    .findOne({ $or: [{ email }, { token }] })
    .then((res) => {
      if (!res) return null;

      const foundEmail = res.email;

      const newToken = crypto
        .createHash('sha256')
        .update(salt2 + ' | ' + future + ' | ' + email)
        .digest('hex');

      return db
        .getDB()
        .collection(COLLECTION.USER)
        .updateOne(
          { email: foundEmail },
          { $set: { token: newToken, tokenExpirationDate: future } }
        )
        .then((res) => {
          if (!res) return null;

          return newToken;
        });
    });
};

const FindUserByToken = (token) => {
  return db.getDB().collection(COLLECTION.USER).findOne({ token });
};

const FindUser = (email) => {
  return db.getDB().collection(COLLECTION.USER).findOne({ email });
};

const FindModuleByIdentifier = (token, mac, ip) => {
  return db.getDB().collection(COLLECTION.module).findOne({ token });
};

const CreateUser = (email, password) => {
  return FindUser(email).then((res) => {
    if (res) throw 'no!';
    return db
      .getDB()
      .collection(COLLECTION.USER)
      .insertOne({
        email: email,
        password: getPassHash(password),
      });
  });
};

const CreateModule = (token, mac, ip) => {
  return FindUserByToken(token).then((res) => {
    if (!res) throw 'no!';

    const moduleHash = crypto
      .createHash('sha256')
      .update(salt3 + ' | ' + token + ' | ' + mac + ' | ' + ip)
      .digest('hex');

    return db.getDB().collection(COLLECTION.MODULE).insertOne({
      name: 'Chris!!',
      mac,
      ip,
      token: moduleHash,
      masterUser: res._id,
    });
  });
};

const AssociatedModuleToUser = (userId) => {
  return db
    .getDB()
    .collection(COLLECTION.MODULE)
    .find({
      masterUser: userId,
    })
    .toArray();
};

module.exports = {
  Login,
  FindUserByToken,
  FindUser,
  FindModuleByIdentifier,
  CreateUser,
  CreateModule,
  AssociatedModuleToUser,
};
