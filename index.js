const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// ---> middle wares
app.use(cors());
app.use(express.json());

// ---> test server
app.get('/', (req, res) => {
    res.send('ema jhon simple server running')
})

// ---> mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.76zc9vk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        // ---> collections
        const productsCollection = client.db('emaJhonSimple').collection('products')

        // ---> products data 
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size)

            const query = {};

            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count, products })

        });

        // ---> query for pagination
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectId = ids.map(id => ObjectId(id))

            const query = { _id: { $in: objectId } };

            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

    } finally { }
}
run().catch(err => console.log(err))




app.listen(port, () => {
    console.log(`ema jhon simple running from port : ${port}`)
})
