import express from 'express'
import cors from 'cors'
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
  });

  const port = 3000;


  const exampleData = {
    Math: [
      {
        date: '2024-02-02',
        images: ['url1', 'url2'],
      },
      {
        date: '2024-02-03',
        images: ['url3', 'url4'],
      },
    ],
    Physics: [
      {
        date: '2024-02-02',
        images: ['url5', 'url6'],
      },
      {
        date: '2024-02-03',
        images: ['url7', 'url8'],
      },
    ],
  };

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);  
});
app.get('/get-all-data', (req, res) => {
    res.send(exampleData);  
  });