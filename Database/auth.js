const db = require('./db');
const crypto = require('crypto');
const { COLLECTION } = require('../Constants/DB.constant');

const salt1 = 'RTEWY4[5wylpgw[-fi0q4tu905w4jgtsmvq';
const salt2 = "'gw;lh[pnrs-0aoe5fDFSHU;ly5sp4[oa0r-D";

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

module.exports = {
  Login,
  FindUserByToken,
  FindUser,
  CreateUser,
};
