const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6safrl.mongodb.net/?retryWrites=true&w=majority`;

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


    const classesCollection = client.db("summerDb").collection("classes");
    const extraCollection = client.db("summerDb").collection("extra");
    const instructorsCollection = client.db("summerDb").collection("instructors");

    // get classes data
    app.get('/classes', async (req, res) => {
        const result = await classesCollection.find().toArray();
        res.send(result);
      })

      //extra data
    app.get('/extra', async (req, res) => {
        const result = await extraCollection.find().toArray();
        res.send(result);
      })

    //get instructors collection
    app.get('/instructors', async (req, res) => {
        const result = await instructorsCollection.find().toArray();
        res.send(result);
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


app.get('/', (req, res) => {
    res.send('Summer Camp ')
})


app.listen(port, () => {
    console.log(`Summer Camp is coming soon on port: ${port}`)
})