const { client } = require('../database/db');

var dbo = client.db('user');

const createUser = async (userData) => {
  await dbo
    .collection('users')
    .insertOne(userData)
    .then(() => {});
  console.log(`Added on username: ${userName}`);
};

const findUser = async (userName) => {
  return await dbo.collection('users').findOne({ name: userName });
};

module.exports = { createUser, findUser };
