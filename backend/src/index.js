import express from 'express';
import { MongoClient } from 'mongodb';
import { fetchAllSubjects } from './controllers/fetchAllSubjects.js';
import { fetchImagesByDateAndConvertToPDF } from './controllers/ImageControllers.js';
import { fetchSubjectDate } from './controllers/fetchSubjectDate.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchContentOfSubjectByDate } from './controllers/fetchContentOfSubjectByDate.js';
import { generateFlashcardsByDate } from './controllers/generateflashcards.js';
import { generateQuizesByDate } from './controllers/generateQuizesByDate.js';
import { summarizeTextsByDate } from './controllers/summarizeTexts.js';
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
const port = 3000;


// MongoDB setup
const url = process.env.MONGODB_URI;
const dbName = 'fourth_Sem';
const client = new MongoClient(url);

let db; // Declare a variable to store the connected db instance

// Connect to MongoDB once at startup
const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(dbName); // Store the db instance
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
};


connectDB();

app.use(express.json());

app.get('/get-all-subjects', (req, res) => fetchAllSubjects(req, res, db));
app.get('/getSubjectData/:subjectName', (req, res) => fetchSubjectDate(req, res, db));
app.get('/getSubjectContent/:date', (req, res) => fetchContentOfSubjectByDate(req, res, db))
app.get('/generateFlashcards/:date', (req, res) => generateFlashcardsByDate(req, res, db))
app.get('/generateQuizes/:date', (req, res) => generateQuizesByDate(req, res, db))
app.get('/summarizeTexts/:date',(req,res)=> summarizeTextsByDate(req,res,db))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
