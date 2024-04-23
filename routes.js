import express from 'express';
import db from './db.js';

import { ObjectId } from 'mongodb';

const router= express.Router(); //takes care of all requests

router.get('/', async (req,res) =>{
    const collection = await db.collection("items");
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
    
})

router.post('/register', async(req,res)=>{
    try{
        let newDocument={
            username:req.body.username,
            password:req.body.password
        }
        let collection = await db.collection('users');//create collection of users
        let result = await collection.insertOne(Document);
        res.send(result).status(204)
    } catch(err){
        console.error(err)
    }
})


export default router; 