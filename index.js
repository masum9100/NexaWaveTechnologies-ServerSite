const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5001
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rdnshyp.mongodb.net/?retryWrites=true&w=majority`;


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

        const allProduct = client.db("productDB").collection("product")


        app.get('/product', async(req, res)=>{
            const cursor = allProduct.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/product', async(req, res)=>{
            const newProduct =req.body
            console.log(newProduct)
            const result = await allProduct.insertOne(newProduct);
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello, this is my server ollaalala")
})

app.listen(port, () => {
    console.log(`my server is running on port: ${port}`)
})