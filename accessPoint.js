const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()
const jsonParser = bodyParser.json()
const port = 59595
const repertoire= '/'

var index = 0

getExpress = () => {
    return app;
}

setup = () => {
    app.use(jsonParser)

    app.get(repertoire, (req, res) => {
        db.getAllSensorData().then(data => {
            res.send(data)
        })
    })
    
    app.post(repertoire, (req, res) => {
        console.log(req.body, index++)
        data = req.body.map(x => {
            return {
                timestamp: new Date(),
                ...x
            }
        })

        db.addSensorData(data)
        res.send('Roger that captain')
    })
    
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    })
}

module.exports = {
    getExpress,
    setup,
  };
  