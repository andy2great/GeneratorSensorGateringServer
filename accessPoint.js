const express = require('express')              // librairie du node_module qui gère les endpoint
const bodyParser = require('body-parser')       // librairie du node_module qui parse 
const db = require('./db')                      // inclue le fichier db.js

const app = express()                           // app gère les endpoints
const jsonParser = bodyParser.json()            // parse JSON
const port = 59595                              // Important: Défini le port ici
// const repertoire= '/'

var index = 0

// donner référence à "app" pour faire des end point.
getExpress = () => {
    return app;
}

setup = () => {
    
    // tout au long, utilise JSON parser
    app.use(jsonParser)

    // Point accès pour obtenir les valeurs de référence
    app.get('/reference/obtenir', (req, res) => {
        db.ObtenirRefValeur().then(data => {
            res.send(
                data.map((x, i) => ({
                    ...x,
                    _id: i,
                })
            ))
        })
    })

    // Point accès pour obtenir les valeurs de référence
    app.get('/senseurs/obtenir', (req, res) => {
        db.ObtenirSenseursData().then(data => {
            res.send(data)
        })
    })
    
    app.post('/senseurs/soummettre', (req, res) => {
        console.log(req.body, index++)
       
       // ajouter timestamps dans la liste avec la fonction map
       // assurer JSON est en array
        data = req.body.map(x => {
            return {
                timestamp: new Date(),
                ...x
            }
        })
        
        db.AjouterSenseursData(data)
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
  