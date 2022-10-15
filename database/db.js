const { MongoClient } = require('mongodb');
// Connection URI
const uri =
  'mongodb+srv://Jackie:1234@cluster0.tbzfd2l.mongodb.net/?retryWrites=true&w=majority';
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  // Connect the client to the server (optional starting in v4.7)
  await client.connect();
  // Establish and verify connection
  await client.db('admin').command({ ping: 1 });
  console.log('Connected successfully to server');
}
run().catch(console.dir);

module.exports = { client };
