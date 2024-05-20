import { MongoClient } from "mongodb";

class MongoConnection {

    static async open() {
        if (this.db) return this.db
        console.log("connecting to mongo", this.url);
        const client = new MongoClient(this.url, this.options);
        await client.connect();
        this.db = client.db('db_ruslan_betest')
        return this.db
    }

}

MongoConnection.db = null
MongoConnection.url = 'mongodb://127.0.0.1:27017'
MongoConnection.options = {}

export default MongoConnection