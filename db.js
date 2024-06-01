import {MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';


dotenv.config()


const uri = process.env.URI;

const client = new MongoClient(uri , {
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}); 

try{
    await client.connect();
    await client.db("personal-blog").command({ping:1})
    console.log("Pinged deployment. Successfully connected to MongoDB!")
} catch(err){
    console.log(err)
}

let db=client.db('personal-blog')

export default db;