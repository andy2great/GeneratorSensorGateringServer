const express = require('express')
const app = express()
const port = 59595
var repertoire= '*'
var index = 0

var msg = 'Hello World';
console.log(msg);

app.get(repertoire, (req, res) => {
    console.log(req, index++)
    res.send(`Hello World! ${index - 1}`)
})
  

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})