import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes.js';


const app = express(); 
app.use(cors())
app.use(express.json())

app.use(cookieParser())
app.use( router)



app.listen(8000, ()=>{
    console.log("App is up and running")
})