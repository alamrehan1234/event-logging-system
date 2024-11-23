const mongoose = require('mongoose');

//create log schema
const logSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sourceAppId: { type: String, required: true },
    dataPayload: { type: mongoose.Schema.Types.Mixed, required: true }, // The Mixed type allows this field to store any type of data, including objects, arrays, strings, numbers, etc
    globalHash: { type: String },
    globalPrevHash: { type: String },
    clientHash: { type: String },
    clientPrevHash: { type: String },
});

// Create index
logSchema.index({ eventType: 1, sourceAppId: 1, timestamp: -1 });

// create model using schema
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
