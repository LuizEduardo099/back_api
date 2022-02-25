const cors = require('cors')
const express = require('express')
const app = express()
const mqtt = require('./src/mqtt')

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/devices', mqtt.listDevices)
app.post('/defineTurn', mqtt.defineTurn)
app.post('/defineState', mqtt.defineState)
app.get('/join', mqtt.join)
app.get('/unjoin', mqtt.unJoin)
app.post('/rename', mqtt.rename)
app.post('/status', mqtt.status)
app.get('/gettype', mqtt.escreveType)



app.listen(process.env.PORT || 4000, () => console.log("Server ok !"))