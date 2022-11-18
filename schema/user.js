const { client } = require('../database/db');

var dbo = client.db('user');

const createUser = async (userData) => {
  await dbo
    .collection('users')
    .insertOne(userData)
    .then((res) => {
      console.log(`Added username on database: ${userData.name}`);
    });
};

const findUser = async (name) => {
  return await dbo.collection('users').findOne({ name: name });
};

const updateUserData = async (userData) => {
  return await dbo
    .collection('users')
    .updateOne(
      { name: userData.name },
      { $set: { score: userData?.score, avatarId: userData?.avatarId } }
    )
    .then((res) => {
      console.log(`Update User:${userData.name} data`);
    });
};

const deleteCollection = async () => {
  return await dbo
    .collection('users')
    .deleteMany({})
    .then((res) => {
      console.log(`Delete all users`);
    });
};

module.exports = { createUser, findUser, updateUserData, deleteCollection };
