const express = require('express');
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv');
const cors = require('cors')

// middlewares
app.use(express.json());
app.use(cors());
dotenv.config();

app.set('view engine', 'ejs');
app.set('views', './views'); 

// CONNECT TO DATABASE
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Check if DB connection works
db.connect((err) => {
    if(err) {
        return console.log("error connecting to the database: ", err)
    }
    console.log("succesfully connected to MYSQL: ", db.threadId)
})

// Define a route for the home page
app.get('/', (req, res) => {
    res.send('Hello Pretty People i miss you!'); // Responds to the root URL
});

// Define a route for /data
app.get('/data', (req,res)=>{
    const patient = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(patient, (err, data)=>{
        if(err){
         return res.status(400).send("Failed to get patient_id, first_name, last_name, date_of_birth", err)
        }

        const firstNamesOnly = data.map(row => ({ first_name: row.first_name }));

         // Render the EJS file with both data sets
         res.status(200).render('data', { data, firstNamesOnly });

        // res.status(200).send(data)
        // res.status(200).render('data', { data })
    })
})

app.get('/provider', (req,res)=>{
    const provider = "SELECT  first_name, last_name, provider_specialty FROM providers"
    db.query(provider, (err, data)=>{
        if(err){
         return res.status(400).send("Failed to get patient_id, first_name, last_name, date_of_birth", err)
        }

         // Create an array of first names only
         const firstNamesOnly = data.map(row => ({ first_name: row.first_name }));

         // Render the EJS file with both data sets
         res.status(200).render('provider', { data, firstNamesOnly });

            // this is for rendering only database containig firstNamesOnly,last and date of birth
        // res.status(200).send(data) for json on the browser
        // res.status(200).render('provider', { data })
    })
})

const Port = 3700
app.listen(Port, ()=> {
    console.log(`server is runnig on http://localhost:${Port}`)
})
