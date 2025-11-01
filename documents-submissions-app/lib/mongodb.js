import { MongoClient } from "mongodb";

const uri = "mongodb+srv://techclinicc_db_user:fz7aULxeVYcJQ1EJ@denningcluster.ek6bu8f.mongodb.net/?appName=DenningCluster";
const options = {};

let client;
let clientPromise;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;

