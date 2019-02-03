const MongoClient = require("mongodb").MongoClient;

class MongoDbHistory {
  constructor(mongoClient) {
    this.mongo = mongoClient;
    this.db = this.mongo.db();
  }

  async disconnect() {
    return this.mongo.close();
  }

  put(id, eventData) {
    return this._collection().replaceOne(
      { _id: id },
      {
        _id: id,
        data: eventData
      },
      { upsert: true }
    );
  }

  getAll() {
    return this._collection()
      .find({})
      .limit(1000)
      .map(this._toEvent)
      .toArray();
  }

  async get(id) {
    const doc = await this._collection().findOne({ _id: id });
    return doc == null ? null : this._toEvent(doc);
  }

  _collection() {
    return this.db.collection("events");
  }

  _toEvent(storedEvent) {
    return storedEvent.data;
  }
}

module.exports.createHistory = async mongoUrl => {
  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    w: "majority"
  });
  await client.connect();

  return new MongoDbHistory(client);
};
