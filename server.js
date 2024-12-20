import express from "express";
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";

const saltRounds = 10;
const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors());

// Handle CORS Preflight (OPTIONS) Request
//app.options('*', cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Test DB Connection
db.connect(err => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Database connected successfully.");
    }
});

// Register Route
app.post("/register", (req, res) => {
    const sql = `INSERT INTO login (name, email, password) VALUES (?)`;

    // Hash the password
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ Error: "Error hashing password" });
        }

        // Values to be inserted
        const values = [
            req.body.name,
            req.body.email,
            hash
        ];

        // Query the database
        db.query(sql, [values], (err, result) => {
            if (err) {
                return res.status(500).json({ Error: "Database Insertion Error" });
            }
            return res.status(200).json({ status: "Success", result });
        });
    });
});
app.post("/Login",(req,res)=>{
    const sql="SELECT * FROM login WHERE email=?";
    db.query(sql,[req.body.email],(err,data)=>{
        if(err) return res.json({Error: "Login error in server"})
        if(data.length>0){
            bcrypt.compare(req.body.password.toString(),data[0].password,(err,response)=>{
                if (err) return res.json({Error :"Password compare error"})
                if (response){
                    return res.json({Status:"Success"})
                }else{
                    return res.json ({Error :"Password mismacted"})
                }
            })
        }else{
            return res.json({Error:"No email existed"})
        }
    })
})
// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000...");
});
