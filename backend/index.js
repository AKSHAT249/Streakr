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
            return res.status(200).json({ message: "No tasks found" });
        }
        res.json(result.rows);
    }catch(error){
        console.error("Error", error.message);
        res.status(500).json({ error: "Server error in fetchTask", message: error.message });

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




app.post("/updateTask/:id", async (req, res) => {
    const {id} = req.params;
    const {status, taskId, weekDate} = req.body;
    try{
        const result = await pool.query(
            `INSERT INTO task_completion (user_id, task_id, is_done, checked_at, date)
             VALUES ($1, $2, $3, NOW(), $4)
             ON CONFLICT (user_id, task_id, date)
             DO UPDATE SET is_done = $3, checked_at = NOW()
             RETURNING *`,
            [id, taskId, status, weekDate]   // only 3 params now — no date needed
          );

        if(result){
            return res.status(201).json({message:result});
        }


    }catch(error){
        return res.status(404).json({error:error.message})

    }
} )


app.post("/tasks/week/:userId", async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.body; // e.g. ?startDate=2026-06-15&endDate=2026-06-21
  
    try {
      const result = await pool.query(
        `SELECT ut.task_id, ut.user_id, ut.task_name, ut.category, tc.is_done, tc.date
        FROM public.usertask ut
        LEFT JOIN public.task_completion tc
        ON ut.task_id = tc.task_id and ut.user_id = tc.user_id and tc.date between $2 and $3
        WHERE ut.user_id = $1`,
        [userId, startDate, endDate]
      );
  
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });





app.listen( process.env.PORT, () => {
    console.log(`🚀 Server is listening to localhost:${process.env.PORT}`)
} )