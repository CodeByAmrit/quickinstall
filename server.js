const express = require('express')
const app = express()
const { win_route } = require("./routes/windows")
require('dotenv').config()
const port = process.env.PORT || 5000
const path = require('path')

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/windows', win_route)

app.listen(port, () => console.log('> Server is up and running on port : ' + `http://localhost:${port}`))