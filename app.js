// Le fichier primaire qui débute le serveur

const ap = require("./accessPoint")     //  inclue le fichier accessPoint.js
const db = require("./db")              //  inclue le fichier db.js

ap.setup()
db.connect(err => {
    if (err) {
        console.log("Cant connect to db: " + err)
        process.exit(-1)
    } else {
        console.log("db connected")
        db.EnleverSenseursData({})                 // Important - à enlever 
    }
});