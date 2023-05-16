const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('ema doctor is running')
})

app.listen(port, () => {
    console.log(` ema API is running  on port : ${port}`)
})