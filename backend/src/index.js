import express from 'express';
import { connectDB } from './utils/connectDB.js';
import { fetchImagesByDateAndConvertToPDF } from './controllers/ImageControllers.js';
const app = express();
const port = 3000;

connectDB();
app.use(express.json());

app.get('/convert/:date', fetchImagesByDateAndConvertToPDF);
// app.get('/convert-local/:imageName', fetchImagesByDateAndConvertToPDF);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
