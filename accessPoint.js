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

    // Point accès pour obtenir les valeurs de référence
    app.get('/ValeurReference/ObtenirValeurInitiale', (req, res) => {
        db.getAllRefData().then(data => {
            res.send(data)
        })
    })

    app.get('/sensors/getAllSensors', (req, res) => {
        db.getAllSensorData().then(data => {
            res.send(data)
        })
    })
    
    app.post('/sensors/soummettreValeur', (req, res) => {
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
  