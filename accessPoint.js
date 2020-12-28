const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const jsonParser = bodyParser.json()
const port = 59595
const repertoire= '/'


var msg = 'Hello World';
var index = 0

getExpress = () => {
    return app;
}

setup = () => {
    app.use(jsonParser)

    app.get(repertoire, (req, res) => {
        console.log(req, index++)
        res.send(`Hello World! ${index - 1}`)
    })
    
    app.post(repertoire, (req, res) => {
        console.log(req.body, index++)
        res.send(`Hello World! ${index - 1}`)
    })
    
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    })
}

module.exports = {
    getExpress,
    setup,
  };
  