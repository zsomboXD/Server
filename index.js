import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import { configDB } from './configDB.js'
const PORT=8000

let connection

try {
    connection=await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
    
}

const app=express()
app.use(express.json())
app.use(cors())

app.get('/todos',async (req,resp)=>{
    try {
        const sql='SELECT * FROM todos order by timestamp desc'
        const [rows,fields]=await connection.execute(sql)
        console.log(rows,fields);
        resp.send(rows)
        
    } catch (error) {
        console.log(error);
        
    }
})

app.post('/todos',async (req,resp)=>{
    const {task}=req.body
    if(!task) return resp.status(400).json({msg:'Hiányos adatok!'})
    try {
        const sql='insert into todos (task) VALUES (?)'
        const values=[task]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);
        
        resp.status(200).json({msg:'sikeres hozzáadás!'})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:'server error:'+error})
    }
})
app.delete('/todos/:id',async (req,resp)=>{
    const {id}=req.params
   try {
        const sql='delete from todos where id=?'
        const values=[id]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);        
        resp.status(200).json({msg:'sikeres törlés!'})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:'server error:'+error})
    }
})

app.put('/todos/completed/:id',async (req,resp)=>{
    const {id}=req.params
   try {
        const sql='update todos set completed= NOT completed where id=?'
        const values=[id]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);        
        resp.status(200).json({msg:'sikeres módosítás!'})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:'server error:'+error})
    }
})
app.put('/todos/task/:id',async (req,resp)=>{
    const {id}=req.params
    const {task}=req.body
   try {
        const sql='update todos set task= ? where id=?'
        const values=[task,id]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);        
        resp.status(200).json({msg:'sikeres módosítás!'})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:'server error:'+error})
    }
})




app.listen(PORT,()=>console.log(`server listening on port ${PORT}....`))