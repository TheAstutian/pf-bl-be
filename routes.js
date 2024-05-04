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

//api for register
router.post('/register', async(req,res)=>{

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(req.body.password,salt);

    try{
        let newDocument={
            username:req.body.username,
            password:passwordHash
        }
        let collection = await db.collection('users');//create collection of users
        const user = await collection.findOne({username:req.body.username})
        if(user) {
            return res.status(400).json("User already exists")
        } else await collection.insertOne(newDocument);
        return res.status(204).json("New user successfully created")
    } catch(err){
        console.error(err)
    }
})

//api for login
router.post('/login', async (req,res)=>{
 
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
        
        return res.status(200).json(user.username)
    }catch(err){
        console.error(err)
    }
})

//api to get a post

router.get('/post', async (req,res)=>{

    try{
        const collection = await db.collection("items")
        const post = await collection.findOne({
            _id: req.body.username
        })
        return res.status(200).json(post)

    }catch(err){
        console.log(err)
    }
})

//get all items

router.get('/home', async(req,res)=>{
    try{
    const collection = await db.collection('items')
    const posts = await collection.find({}).toArray()
    res.send(posts).status(200);
    }catch(err){
        console.log(err)
    }
})

//insert new post

router.post('/write', async (req,res)=>{

    try{

        let newDocument={
            title:req.body.title,
            subTitle:req.body.subTitle,
            quote: req.body.quote,
            quoter: req.body.quoter,
            model: req.body.model,
            imglnk:req.body.imglnk,
            date:req.body.date

        }
        let collection = await db.collection('items');//create collection of users
        await collection.insertOne(newDocument);
        return res.status(200).json("new post created successfully")
    }catch(err){
        console.log(err)
    }

})


export default router; 