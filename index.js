import express from 'express';
import {MongoClient, ServerApiVersion} from 'mongodb';

import dotenv from 'dotenv';

dotenv.config()


const app = express(); 

app.use(express.json())

const uri = process.env.URI;


const client = new MongoClient(uri /*, {
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}*/);

async function run(){
    try{
        const database = client.db('blog')
        const posts = database.collection('users')

        const query = { id: 1}

        const options = {
            projection: {_id:0, title:1, username:1, email:1}
        }

        const post = await posts.findOne(query,options)
        console.log(post)

     } finally{
        await client.close();
    }
}

run().catch(console.dir)



app.listen(8000, ()=>{
    console.log("App is up and running")
})