const ap = require("./accessPoint")
const db = require("./db")

ap.setup()
db.connect(err => {
    if (err) {
        console.log("Cant connect to db: " + err)
        process.exit(-1)
    } else {
        console.log("db connected")
        db.deleteSensorData({})
    }
});