const express = require('express')
const app = express()
const port = 68686

var msg = 'Hello World';
console.log(msg);

app.get('/', (req, res) => {
    console.log(req);
    res.send('Hello World!')
})
  

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})