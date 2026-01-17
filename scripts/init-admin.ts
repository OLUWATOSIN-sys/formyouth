import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://oolaniranolu:newpassword@cluster0.etk9wv5.mongodb.net/?appName=Cluster0";

async function initAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db("heavensgate");
    
    const existingAdmin = await db.collection("admin").findOne({});
    
    if (!existingAdmin) {
      await db.collection("admin").insertOne({
        password: "admin123",
        createdAt: new Date().toISOString(),
      });
      console.log("Admin account created with password: admin123");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

initAdmin();
