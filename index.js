const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// this middleware
app.use(cors());
app.use(express.json());

//user: sajalb1899
//passward: e2b4fDMNLCBIB0Cb
//passward2: TQ8NQX1uQRfxLhGL




const uri = "mongodb+srv://sajalb1899:TQ8NQX1uQRfxLhGL@cluster0.2fbewnn.mongodb.net/?retryWrites=true&w=majority";

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

        const usersCollection = client.db("userDB").collection("users");

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/update/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await usersCollection.insertOne(user);
            res.send(result)

        })
        app.put('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);

            const filter = {_id: new ObjectId(id)};
            const options = {upsert:true};
            const updateUser = {
                $set:{
                    name: user.name,
                    email: user.email
                }
            }
            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('from data base', id)
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
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




app.get('/', (req, res) => {
    res.send('SIMPLE CRUD IS RUNNING')
})

app.listen(port, () => {
    console.log(`simple curd in running port, ${port}`)
})