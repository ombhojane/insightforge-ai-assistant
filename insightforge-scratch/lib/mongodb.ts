import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;
const MONGODB_DB = process.env.NEXT_PUBLIC_MONGODB_DB as string;

console.log("mong uri",MONGODB_URI)

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  console.log("connected successfully")

  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}