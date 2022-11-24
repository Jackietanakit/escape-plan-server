const { MongoClient } = require('mongodb');
require('dotenv').config();
// Connection URI
const uri = process.env.MONGO_URI;
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  // Connect the client to the server (optional starting in v4.7)
  await client.connect();
  // Establish and verify connection
  await client.db('admin').command({ ping: 1 });
  console.log('Connected successfully to database');
}
run().catch(console.dir);

module.exports = { client };
