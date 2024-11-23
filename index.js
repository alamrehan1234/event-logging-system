const express = require('express');
const dbConnection = require('./database/db');
const logRoute = require("./route/logRoute");

require('dotenv').config();
const app = express();
app.use(express.json());

app.use("/api/log", logRoute)


const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await dbConnection();
    console.log(`Server running on port ${PORT}`);
});
