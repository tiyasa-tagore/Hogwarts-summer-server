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
    // await client.connect();


    const classesCollection = client.db("summerDb").collection("classes");
    const extraCollection = client.db("summerDb").collection("extra");
    const instructorsCollection = client.db("summerDb").collection("instructors");
    const usersCollection = client.db("summerDb").collection("users");
    const cartsCollection = client.db("summerDb").collection("carts");


    //user
    app.post('/users', async (req, res) => {
        console.log('Received POST request at /users');
  console.log('Request body:', req.body);

        const user = req.body;
         const query = { email: user.email }
        const existingUser = await usersCollection.findOne(query);
  
        if (existingUser) {
          return res.send({ message: 'user already exists' })
        }
  
        const result = await usersCollection.insertOne(user);
        console.log('User inserted:', result);
        res.send(result);
      });

      app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      })

      app.post('/carts', async (req, res) => {
        const item = req.body;
        console.log(item);
        const result = await cartsCollection.insertOne(item);
        res.send(result);
      })
      app.patch('/users/admin/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: 'admin'
          },
        };
  
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
  
      });
    // get classes data
    app.get('/classes', async (req, res) => {
        const result = await classesCollection.find().toArray();
        res.send(result);
      })
    // app.get('/classes/:id', async (req, res) => {
    //     const result = await classesCollection.find().toArray();
    //     res.send(result);
    //   })

    //   app.post('/classes', async (req, res) => {
    //     const item = req.body;
    //     const result = await classesCollection.insertOne(item);
    //     res.send(result);
    //   })

    //   app.delete('/classes/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: new ObjectId(id) };
    //     const result = await classesCollection.deleteOne(query);
    //     res.send(result);
    //   })

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