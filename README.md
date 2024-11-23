
# Event Logging System with Blockchain-inspired Tamper-Proof Design

## Overview

This is a tamper-proof event logging system designed to receive and store event logs from various client applications. It uses cryptographic hashing to link logs in a blockchain-like fashion to ensure the integrity and immutability of logs. The system allows querying logs based on filters such as timestamp range and event type, and supports pagination for handling large datasets.

## Features Implemented

### 1. **Event Logging API**:
   - A RESTful API to receive event logs from client applications.
   - Logs contain metadata such as event type, timestamp, source application ID, and data payload in JSON format.
   - Each log is stored with two types of hashes: **global hash** (for global chain) and **client hash** (for client-specific chain).

### 2. **Tamper-Proof Design**:
   - Logs are linked using cryptographic hashes, ensuring that each log references the previous one, creating a chain of events.
   - This design mimics a lightweight blockchain to prevent tampering.

### 3. **Log Querying**:
   - The API allows querying logs by filters such as timestamp range, event type, and source application.
   - Supports **pagination** to manage large sets of logs efficiently.

### 4. **Error Handling and Validation**:
   - Robust error handling for missing fields, invalid event data, and conflicting hashes.
   - Logs are validated against a predefined schema to ensure consistency.

## Features Not Yet Implemented (Future Upgrades)

   - **Horizontal Scalability**:
     - In the future, the system could be horizontally scaled using load balancers and sharding techniques for better performance and scalability.
     - These technologies require additional setup and might not be feasible under certain hosting plans like free tiers (e.g., no sharding available in MongoDB's free tier).
   
   - **WebSocket or Server-Sent Events (SSE)** for Real-Time Log Streaming:
     - The real-time streaming of logs using WebSocket or SSE is planned for future releases. However, these technologies are outside the scope for this assignment, and you can explore them later.
   
   - **Decentralization Simulation**:
     - A decentralized system with leader election or consensus mechanisms is another potential upgrade. This involves more complex technologies that are not open-source and require server orchestration, which is outside the current scope.

## Project Setup

### Prerequisites
1. **Node.js** installed on your system (v14 or later).

### Installation

#### Step 1: Clone the repository
```bash
git clone https://github.com/alamrehan1234/event-logging-system.git
cd event-logging-system
```

#### Step 2: Install the dependencies
```bash
npm install
```

#### Step 3: Create a `.env` file
Create a `.env` file in the root directory of the project and add the following credentials:

```env
MONGO_URL=mongodb+srv://event-logging-system:CX2wTirGFFDRuydI@cluster0.s3emt.mongodb.net/event-logging-system?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
```

#### Step 4: Run the project
To start the server, run:

```bash
npm start
```

The server will start on `localhost:3000`.


## API Routes

### 1. **Create Event**
   - **URL**: `POST /api/log/create`
   - **Description**: Accepts a log entry from the client application and stores it in the database with necessary metadata and cryptographic hashes.
   - **Example Request**:
     ```json
     {
       "eventType": "login",
       "timestamp": "2024-11-23T10:00:00Z",
       "sourceAppId": "ClientA",
       "dataPayload": {"userId": "12345", "status": "success"}
     }
     ```

### 2. **Search Event**
   - **URL**: `GET /api/log/search`
   - **Description**: Allows querying of logs by timestamp range, event type, and source application. Supports pagination.
   - **Example Request**:
     ```bash
     localhost:3000/api/log/search?timestampStart=2024-11-23T00:00:00Z&timestampEnd=2024-11-23T10:31:59Z&page=2
     ```

   - **Query Parameters**:
     - `timestampStart` (required): The start of the timestamp range (ISO 8601 format).
     - `timestampEnd` (required): The end of the timestamp range (ISO 8601 format).
     - `eventType` (optional): The type of event to filter by.
     - `sourceAppId` (optional): The source application ID to filter logs by.
     - `page` (optional): The page number for pagination (default is 1).

### Example Response for Search:
```json
[
  {
    "eventId": 1,
    "clientId": "ClientA",
    "timestamp": "2024-11-21T10:00:00Z",
    "dataPayload": {"key": "value"},
    "globalPrevHash": null,
    "globalHash": "globalHash1",
    "clientPrevHash": null,
    "clientHash": "clientA_hash1"
  },
  {
    "eventId": 2,
    "clientId": "ClientA",
    "timestamp": "2024-11-21T10:01:00Z",
    "dataPayload": {"key": "value"},
    "globalPrevHash": "globalHash1",
    "globalHash": "globalHash2",
    "clientPrevHash": "clientA_hash1",
    "clientHash": "clientA_hash2"
  }
]
```

## License

This project is open-source and available under the MIT License.
