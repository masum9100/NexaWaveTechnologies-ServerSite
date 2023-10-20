const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5001
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const myCart = client.db("productDB").collection("cart")
        


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

        // my cart data 
        

        app.get('/cart', async(req, res)=>{
            const cursor = myCart.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/cart', async(req, res)=>{
            // const myCart =req.body
            console.log("59", myCart)
            const result = await myCart.insertOne(req.body);
            res.send(result)
        })

        app.delete('/cart/:id', async(req,res)=>{
            const id = req.params.id
            const query ={_id: new ObjectId(id)}
            const result = await myCart.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection/
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error/////
        // await client.close();
    }
}
run().catch(console.dir);


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello, this is my server")
})

app.listen(port, () => {
    console.log(`my server is running on port: ${port}`)
})