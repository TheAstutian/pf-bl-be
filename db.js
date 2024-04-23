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

/*async function run(){
    try{
        const database = client.db('personal-blog')
        const posts = database.collection('items')

        const query = { id: 1}

        const options = {
            projection: {_id:0, title:1, username:1, password:1}
        }

        const post = await posts.findOne(query,options)
        console.log(post)
 
     } finally{
        await client.close();
    }
}

run().catch(console.dir) */

try{
    await client.connect();
    await client.db("personal-blog").command({ping:1})
    console.log("Pinged deployment. Successfully connected to MongoDB!")
} catch(err){
    console.log(err)
}

let db=client.db('personal-blog')

export default db;