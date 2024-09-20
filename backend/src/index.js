  import express from 'express';
  import { MongoClient } from 'mongodb';
  import { fetchAllSubjects } from './controllers/fetchAllSubjects.js';
  import { fetchImagesByDateAndConvertToPDF } from './controllers/ImageControllers.js';
  import { fetchSubjectDate } from './controllers/fetchSubjectDate.js';
  import cors from 'cors';
  import dotenv from 'dotenv';
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

  // Updated routes that now use the `db` instance
  app.get('/get-all-subjects', (req, res) => fetchAllSubjects(req, res, db));
  app.get('/convert/:date', (req, res) => fetchImagesByDateAndConvertToPDF(req, res, db));
  app.get('/getSubjectData/:subjectName',(req,res)=>fetchSubjectDate(req,res,db));
  app.get('/getSubjectContent/:date',(req,res)=>fetchContentOfSubjectByDate(req,res,db))

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
