const Log = require("../model/Log")
const generateHash = require("../utils/genHash")

// create event controller

const createLogController = async (req, res, next) => {
    //Destructure body parameters
    const { eventType, sourceAppId, dataPayload } = req.body;

    //Validating if required parameters are missing
    if (!eventType || !sourceAppId || !dataPayload) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {

        // fetch most recent log
        const prevLog = await Log.findOne({}).sort({ timestamp: -1 });

        //fetch most recent clients log
        const clientPrevLog = await Log.findOne({ sourceAppId: sourceAppId }).sort({ timestamp: -1 });

        const globalPrevHash = prevLog ? prevLog.globalHash : null; // fetch previous global hash if available otherwise setting null
        const clientPrevHash = clientPrevLog ? clientPrevLog.clientHash : null; // fetch client's previous hash if available otherwise setting null

        // generate hashes
        const globalHash = generateHash({ eventType, sourceAppId, dataPayload, globalPrevHash });
        const clientHash = generateHash({ eventType, sourceAppId, dataPayload, clientPrevHash });

        // log instance
        const newLog = new Log({
            eventType,
            sourceAppId,
            dataPayload,
            globalHash,
            globalPrevHash,
            clientHash,
            clientPrevHash,
        });

        // save the log to databse
        await newLog.save();

        res.status(201).json(newLog);

    } catch (error) {
        next(error);
    }
}


// search/querying event controller

const serachLogController = async (req, res, next) => {
    try {
        // Destructure query parameters
        const { eventType, sourceAppId, timestampStart, timestampEnd, page = 1, limit = 5 } = req.query;

        // Build the filter object based on the query parameters
        const filter = {};

        if (eventType) {
            filter.eventType = eventType;
        }
        if (sourceAppId) {
            filter.sourceAppId = sourceAppId;
        }
        if (timestampStart || timestampEnd) {
            filter.timestamp = {};
            if (timestampStart) {
                filter.timestamp.$gte = new Date(timestampStart); // Greater than or equal to start date
            }
            if (timestampEnd) {
                filter.timestamp.$lte = new Date(timestampEnd); // Less than or equal to end date
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const logs = await Log.find(filter)
            .sort({ timestamp: -1 }) // Sort by most recent
            .skip(skip)
            .limit(Number(limit)) // Convert limit to number
            .lean(); // Use lean for better performance

        // Get the total number of logs matching the filter
        const totalLogs = await Log.countDocuments(filter);

        // Send the paginated logs with total count
        res.json({
            totalLogs,
            totalPages: Math.ceil(totalLogs / limit),
            currentPage: page,
            data: logs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { createLogController, serachLogController }