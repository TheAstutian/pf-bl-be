import express from 'express';
import bcrypt from 'bcryptjs';
import Mongo, { BSON } from'mongodb';
import db from './db.js';

import { ObjectId } from 'mongodb';

const router= express.Router(); //takes care of all requests

router.get('/', async (req,res) =>{
    const collection =  db.collection("users");
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
    
})
//get all posts
router.get('/posts', async(req,res)=>{
    const collection =  db.collection('items')
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
})

//get single post

router.post('/posts/:id', async(req,res)=>{
    const id = req.body.id
    const nid= new BSON.ObjectId(id)
    const collection =  db.collection('items')
    const item = await collection.findOne({
        _id: nid
    })
   return res.status(200).json(item)
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
        let collection =  db.collection('users');//create collection of users
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
        const collection =  db.collection("users");
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
        const collection =  db.collection("items")
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
    const collection =  db.collection('items')
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
            tags: req.body.tags,
            date:req.body.date

        }
        let collection =  db.collection('items');//create collection of users
        await collection.insertOne(newDocument);
        return res.status(200).json("new post created successfully")
    }catch(err){
        console.log(err)
    }

})

//deletePost
router.delete("/delete/:id", async (req,res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)}
        const collection = db.collection("items")
        let result = await collection.deleteOne(query);
        res.send(result).status(200);
    } catch(err){
        console.log(err)
    }
})

//update Post

router.patch("/update/:id", async (req,res)=>{
    
    try{
        const query = {_id: new ObjectId(req.body.id)}
        
        const updates = {
            $set:{
                title:req.body.title,
                subTitle:req.body.subTitle,
                quote: req.body.quote,
                quoter: req.body.quoter,
                model: req.body.model,
                imglnk:req.body.imglnk,
                tags: req.body.tags,

            }
        }
        let collection = await db.collection("items")
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);


    } catch(err){
        console.log(err)
        res.status(500).send("Error updating post")
    }


})

export default router; 