const app = require('../accessPoint').getExpress();
const auth = require('../../Database/auth');

app.post('/login', (req, res) => {
  res.contentType('application/json');

  auth
    .Login(req.body.email, req.body.password)
    .then((result) => {
      if (!result) res.status(400);
      res.json(result);
    })
    .catch((ex) => {
      console.log(ex);
    });
});

app.post('/signup', (req, res) => {
  res.contentType('application/json');
  let create = true;
  const password = req.body.password;
  if (password == '') {
    create = false;
  }

  if (!create) {
    res.send('too bad');
  }

  auth
    .CreateUser(req.body.email, req.body.password)
    .then((result) => {
      if (!result) res.status(400);
      res.send('success!');
    })
    .catch((ex) => {
      res.status(400);
      res.send(400, 'Nop get out!');
    });
});

app.get('module/signup', (req, res) => {
  const token = req.token;
  const mac = req.mac;
  const ip = req.ip;

  auth
    .CreateModule(token, mac, ip)
    .then((result) => {
      if (!result) res.status(400);
      res.send('success!');
    })
    .catch((ex) => {
      res.status(400);
      res.send(400, 'Nop get out!');
    });
});
