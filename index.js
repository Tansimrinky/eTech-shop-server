const express = require("express");
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()



// middleware
app.use(express.json())
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fsmcn5d.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollections = client.db("ProductsDB").collection("Products");
    const brandsCollection = client.db("brandsDB").collection("brands")

    app.get('/products', async(req, res)=>{
      const cursor = productsCollections.find();
      const result = await cursor.toArray();
      return res.send(result)
    })

    app.get('/brands', async(req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

  
    app.post('/brands', async(req, res) => {
      const brand = req.body;
      console.log(brand);
      const result = await brandsCollection.insertOne(brand)
      res.send(result)
    })


    app.post('/products', async(req, res)=>{
      const newProduct = req.body;
      console.log(newProduct)
      const result = await productsCollections.insertOne(newProduct)
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


// jason static file
// app.use(express.static('public'));
// app.get('/brands', (req, res) => {
//     const brandData = require('public')

// })


app.get('/', (req, res ) => {
    res.send('ETechShop server is running.')
})



app.listen(port, () => {
    console.log(`ETechServer is running on port: ${port}`)
})