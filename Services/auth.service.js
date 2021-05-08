const authDb = require('../Database/auth');

isLoggedIn = (req, res, next) => {
  const token = req.header('Token');
  if (token) {
    authDb.FindUserByToken(token).then((user) => {
      authDb.AssociatedModuleToUser(user._id).then((modules) => {
        if (
          user == null ||
          !user.tokenExpirationDate ||
          user.tokenExpirationDate < new Date()
        ) {
          res.status(401);
          res.send(401, 'Unauthorized');
        } else {
          req.user = user;
          req.modules = modules.map((x) => x._id);
          next();
        }
      });
    });
  } else {
    res.send(401, 'Unauthorized');
  }
};

isModuleReal = (req, res, next) => {
  const token = req.header('Token');
  const mac = req.header('Mac');
  const ip = req.ip;

  if (token) {
    authDb.FindModuleByIdentifier(token, mac, ip).then((module) => {
      if (module == null) {
        res.status(401);
        res.send(401, 'Unauthorized');
      } else {
        req.module = module;
        req.token = token;
        req.mac = mac;
        req.ip = ip;
        next();
      }
    });
  } else {
    res.send(401, 'Unauthorized');
  }
};

module.exports = {
  isLoggedIn,
  isModuleReal,
};
