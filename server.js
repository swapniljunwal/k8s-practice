const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017";
const DB_NAME = process.env.DB_NAME || "practice";

app.use(express.json());

const client = new MongoClient(MONGO_URL);

let usersCollection;

async function startServer() {
    try {
        await client.connect();

        console.log("Connected to MongoDB");

        const db = client.db(DB_NAME);
        usersCollection = db.collection("users");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
    res.json({
        message: "Hello from Node.js!",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP"
    });
});

app.get("/api/users", async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve users"
        });
    }
});

app.post("/api/users", async (req, res) => {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email
        };

        const result = await usersCollection.insertOne(user);

        res.status(201).json({
            id: result.insertedId,
            ...user
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to create user"
        });
    }
});

startServer();