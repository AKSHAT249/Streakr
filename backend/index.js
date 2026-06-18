import express from "express";
import 'dotenv/config';
import cors from "cors"; 
import pool from './db.js';



const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('👋 Hey there! Welcome to Taskly — where every request gets the care it deserves. Akshat\'s got you covered!');
});

app.get("/getTask/:id",async (req, res) => {
    const {id} = req.params;
    
    try{
        const result = await pool.query(
            'SELECT * FROM usertask WHERE user_id = $1', [id]
        )
        if (result.rows.length == 0){
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(result.rows[0]);
    }catch(error){
        console.error("Error", error.message);
        res.status(500).json({ error: "Server error in fetchTask" });

    }
})


app.post("/addTask", async (req, res) => {
    const { taskName, category, priority, repeat, userId } = req.body;
    try{

        if(!taskName || !userId){
            return res.status(400).json({error:'All fields are required'});
        }

        const normalizedCategory = category?.toLowerCase();
        const normalizedPriority = priority?.toLowerCase();
        const normalizedRepeat= repeat?.toLowerCase();

        const result = await pool.query(
            'INSERT INTO usertask (user_id, task_name, category, priority, repeat) VALUES ($1, $2, $3, $4, $5)',
            [userId, taskName, normalizedCategory, normalizedPriority, normalizedRepeat] 
        );

        if(result){
            return res.status(201).json({message:"Task added successfully"});
        }

    }catch(error){
        console.log("Error in /addTask", error.message);
        return res.status(500).json({error:'Server error while addingTask'})
    }
})


app.delete("/deleteTask", async (req, res) => {
    const { id } = req.body;

    const result = await pool.query('DELETE FROM usertask where task_id = $1', [id]);

    if(result){
        return res.status(204).json({message:'Task deleted successfully'});
    }

})





app.listen( process.env.PORT, () => {
    console.log(`🚀 Server is listening to localhost:${process.env.PORT}`)
} )