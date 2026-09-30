const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.get("/api/users", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Swapnil"
        },
        {
            id: 2,
            name: "Rahul"
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});