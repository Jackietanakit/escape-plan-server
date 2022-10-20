const { client } = require('../database/db');

var dbo = client.db('user');

const createUser = async (userData) => {
  await dbo
    .collection('users')
    .insertOne(userData)
    .then(() => {});
  console.log(`Added on username: ${userData.name}`);
};

const findUser = async (name) => {
  return await dbo.collection('users').findOne({ name: name });
};

const updateUserScore = async (userData) => {
  return await dbo
    .collection('users')
    .updateOne(
      { name: userData.name },
      { $set: { score: userData.score + 1 } }
    );
};

module.exports = { createUser, findUser, updateUserScore };
