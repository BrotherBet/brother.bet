const admin = require('firebase-admin');

const db = admin.firestore();

const RobotFifaArena = require('../model/resource/RobotFifaArena');

module.exports = {
  async index(req, res) {
    const { year } = req.query;
    const nameCollection = 'fifaChamptionship';

    try {
      const daysToFilter = await getDaysToFilter(nameCollection, year);

      const robot = new RobotFifaArena();
      const database = await robot.main(daysToFilter, year, '2020-01-01');

      await updateCloud(nameCollection, year, database);

      const bundle = await getBundleCloud(nameCollection, year);
      const hashNumber = robot.hash(bundle);
      await updateConsistency({ aggregatedSet: hashNumber });

      res.send(database);
    } catch (error) {
      res.send(error);
    }
  },
};

const getDaysToFilter = async (nameCollection, year) => {
  try {
    const collections = await db.collection(nameCollection).doc(year).listCollections();
    const daysToFilter = collections.map((col) => col.id);

    return daysToFilter;
  } catch (error) {
    throw error;
  }
};

const updateData = async (nameCollection, year, data) => {
  try {
    const response = await db
      .collection(nameCollection)
      .doc(year)
      .collection(data.date)
      .doc(data.id)
      .set(data);

    return response;
  } catch (error) {
    throw error;
  }
};

const updateCloud = async (nameCollection, year, database) => {
  try {
    database.forEach(async (data) => {
      await updateData(nameCollection, year, data);
    });
  } catch (error) {
    throw error;
  }
};

const getBundleCloud = async (nameCollection, year) => {
  try {
    const files = [];
    const snapshots = [];

    const collections = await db.collection(nameCollection).doc(year).listCollections();
    const dates = collections.map((col) => col.id);

    for (const date of dates) {
      snapshots.push(db.collection(nameCollection).doc(year).collection(date).get());
    }

    return new Promise((resolve) => {
      Promise.all(snapshots)
        .then((results) => {
          results.forEach((snapshot) => {
            snapshot.forEach((doc) => files.push(doc.data()));
          });
          resolve(files);
        })
        .catch((error) => console.log('Got an error', error));
    });
  } catch (error) {
    throw error;
  }
};

const updateConsistency = async (data) => {
  try {
    const nameCollection = 'databaseConsistency';

    const response = await db.collection(nameCollection).doc('whole').set(data);

    return response;
  } catch (error) {
    throw error;
  }
};