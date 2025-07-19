import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import Routers from "./routes/matchRoutes.js"

const port = 2000;
const app = express();
const Router = express.Router();

app.use(express.json()); // required to parse req.body
dotenv.config();
// connectDB();

app.use('/api',Routers);

app.get('/',(req,res)=>{
    res.send('Hello')
})

app.listen(port,()=>{
console.log(`server up: http://localhost:${port}`);
})