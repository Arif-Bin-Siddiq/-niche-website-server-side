const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connet uri

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjirj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("motobike");
        // Motobike Product
        const motobikeProductsCollection = database.collection("motobikeProducts");

        // Booking Orders
        const bookingOrdersCollection = database.collection("bookingOrders");

        // Users
        const usersCollection = database.collection("users");

        // Reviews
        const reviewsCollection = database.collection("reviews");

        // motobike all products
        app.get('/motobikeProducts', async (req, res) => {
            const cursor = motobikeProductsCollection.find({});
            const motobikeProducts = await cursor.toArray();
            res.json(motobikeProducts);
        });

        // motobike single products
        app.get('/motobikeProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const motobikeProduct = await motobikeProductsCollection.findOne(query);
            res.json(motobikeProduct);
        })

        // Motobike Manage Product Delete Operation
        app.delete('/motobikeProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await motobikeProductsCollection.deleteOne(query);
            res.json(result);
        });

        // motobike add product
        app.post('/motobikeProducts', async (req, res) => {
            const motobikeProduct = req.body;
            const result = await motobikeProductsCollection.insertOne(motobikeProduct);
            res.send(result);
            // res.send('post hited')
        })


        // Motobike Booking All Order List
        app.get('/bookingOrders', async (req, res) => {
            const cursor = bookingOrdersCollection.find({});
            const bookingOrders = await cursor.toArray();
            res.json(bookingOrders);
        });

        // Motobike Booking My Order Find
        app.get('/bookingOrders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = bookingOrdersCollection.find(query);
            const bookingOrders = await cursor.toArray();
            res.json(bookingOrders);
        });

        // Motobike Booking All Order Delete Operation
        app.delete('/bookingOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingOrdersCollection.deleteOne(query);
            res.json(result);
        });

        // Motobike Booking Order
        app.post('/bookingOrders', async (req, res) => {
            const bookingOrders = req.body;
            console.log('hit the booking api', bookingOrders)
            const result = await bookingOrdersCollection.insertOne(bookingOrders);
            res.send(result);
        });

        // Users Collection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // Make Admin and User find
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // Make Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // Reviews
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.send(result);
            // res.send('post hited')
        });

        // Motobike Booking All Order List
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        });


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Motobike server');
});


app.listen(port, () => {
    console.log('Running Server on Port', port);
})
