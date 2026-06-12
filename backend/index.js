import express from "express";
import 'dotenv/config';



const app = express();

app.get('/', (req, res) => {
    res.send('👋 Hey there! Welcome to Taskly — where every request gets the care it deserves. Akshat\'s got you covered!');
});





app.listen( process.env.PORT, () => {
    console.log(`🚀 Server is listening to localhost:${process.env.PORT}`)
} )