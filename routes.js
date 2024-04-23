import express from 'express';
import bcrypt from 'bcryptjs'
import db from './db.js';

import { ObjectId } from 'mongodb';

const router= express.Router(); //takes care of all requests

router.get('/', async (req,res) =>{
    const collection = await db.collection("users");
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
    
})

router.post('/register', async(req,res)=>{

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(req.body.password,salt);

    try{
        let newDocument={
            username:req.body.username,
            password:passwordHash
        }
        let collection = await db.collection('users');//create collection of users
        let result = await collection.insertOne(newDocument);
        return res.status(204).json("New user successfully created")
    } catch(err){
        console.error(err)
    }
})

router.get('/login', async (req,res)=>{


    try{
        const collection = await db.collection("users");
        const user = await collection.findOne({
            username: req.body.username
        });
        if (!user){
            return res.status(401).json("Invalid username ")
        }
        
        const validatePassword = await bcrypt.compare(req.body.password, user.password)
        
         if(!validatePassword){
            return res.status(401).json("Invalid  password")
        }
        return res.status(200).json('Login successful')
    }catch(err){
        console.error(err)
    }
})


export default router; 