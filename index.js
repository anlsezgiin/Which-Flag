import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
});
db.connect();

let currentQuestion = {};
let totalCorrect = 0;
let countries = [];

async function randomCountry()
{
    try
    {
        const result = await db.query("SELECT * FROM countries");
        countries = result.rows;
        currentQuestion = countries[Math.floor(Math.random()*countries.length)];
        return currentQuestion;
    }
    catch(err)
    {
        console.log("Problems: ",err)
    }
}

app.get("/",async (req,res)=>
{
    await randomCountry(); 
    console.log(currentQuestion);
    res.render("index.ejs",
{
    country: currentQuestion.country_code
});
});

app.listen(port,(req,res)=>
{
    console.log(`Server running on port: ${port}`);
});