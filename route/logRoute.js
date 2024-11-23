const express = require("express");
const router = express.Router();

// importing controller callbacks
const { createLogController, serachLogController } = require("../controller/logController");

// create event log
router.post("/create", createLogController);

//serach event
router.get("/search", serachLogController);

module.exports = router;