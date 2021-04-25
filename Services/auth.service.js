const authDb = require('../Database/auth');

isLoggedIn = (req, res, next) => {
  const token = req.header('Token');
  if (token) {
    authDb.FindUserByToken(token).then((user) => {
      if (
        user == null ||
        !user.tokenExpirationDate ||
        user.tokenExpirationDate < new Date()
      ) {
        res.status(401);
        res.send(401, 'Unauthorized');
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.send(401, 'Unauthorized');
  }
};

module.exports = {
  isLoggedIn,
};
