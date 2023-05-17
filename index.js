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



const uri = `mongodb+srv://${process.env.db_users}:${process.env.db_pass}@cluster0.yk6uldw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const database = client.db("emajhonDB");
        const productcollection = database.collection("products")

        // products
        app.get('/products', async (req, res) => {
            console.log(req.query);
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const skip = page * limit;
            const cursor = productcollection.find();
            const result = await cursor.skip(skip).limit(limit).toArray()
            res.send(result)

        })
        app.get('/totalProducts', async (req, res) => {

            const result = await productcollection.estimatedDocumentCount();
            res.send({ totalProducts: result })

        })
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectids = ids.map(id => new ObjectId(id))
            const query = { _id: { $in: objectids } }
            console.log(ids);
            const cursor = productcollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // app.get('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const options = {
        //         projection: { title: 1, price: 1, service_id: 1, img: 1 },
        //     };
        //     const result = await productcollection.findOne(query, options);
        //     res.send(result);
        // })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('ema doctor is running')
})

app.listen(port, () => {
    console.log(` ema API is running  on port : ${port}`)
})