import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to environment variables");
  }
  
  if (clientPromise) {
    return clientPromise;
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }

  return clientPromise;
}

export default getClientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("heavensgate");
}
